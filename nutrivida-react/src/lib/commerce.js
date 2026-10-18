import {
  amount,
  arrayStored,
  authorizedSession,
  CATEGORIES,
  serviceList,
} from './admin'
import { readSession } from './storage'

const notify = () => window.dispatchEvent(new Event('nutrivida-data'))
const cartKey = () => `nutrivida_compra_${readSession()?.correo || 'invitado'}`
export const readCart = () => arrayStored(cartKey())
export function readCategories() {
  const saved = localStorage.getItem('nutrivida_categorias')
  return saved !== null
    ? arrayStored('nutrivida_categorias')
    : Object.entries(CATEGORIES).map(([id, nombre]) => ({ id, nombre }))
}
function requireAdmin() {
  if (!authorizedSession())
    throw new Error('Acceso exclusivo para administradores.')
}
export function saveCategory(value) {
  requireAdmin()
  if (!value.nombre.trim())
    throw new Error('Escribe el nombre de la categoría.')
  const categories = readCategories()
  if (
    categories.some(
      (item) =>
        item.id !== value.id &&
        item.nombre.toLowerCase() === value.nombre.trim().toLowerCase(),
    )
  )
    throw new Error('Ya existe esa categoría.')
  const item = {
    id: value.id || crypto.randomUUID(),
    nombre: value.nombre.trim(),
  }
  localStorage.setItem(
    'nutrivida_categorias',
    JSON.stringify(
      value.id
        ? categories.map((row) => (row.id === value.id ? item : row))
        : [...categories, item],
    ),
  )
  notify()
}
export function deleteCategory(id) {
  requireAdmin()
  if (serviceList().some((item) => item.categoria === id))
    throw new Error(
      'La categoría tiene servicios asociados. Cámbialos de categoría antes de eliminarla.',
    )
  localStorage.setItem(
    'nutrivida_categorias',
    JSON.stringify(readCategories().filter((item) => item.id !== id)),
  )
  notify()
}
export function salePrice(service) {
  const discount = Math.max(0, Math.min(90, Number(service.descuento) || 0))
  return Math.round(amount(service.precio) * (1 - discount / 100))
}
export function cartDetails() {
  const services = serviceList()
  return readCart().map((row) => {
    const service = services.find((item) => String(item.id) === String(row.id))
    return { ...row, service, precio: service ? salePrice(service) : 0 }
  })
}
export function setCartQuantity(id, quantity) {
  const rows = readCart().filter((row) => String(row.id) !== String(id))
  if (!Number.isInteger(quantity) || quantity < 0 || quantity > 10)
    throw new Error('Selecciona una cantidad entre 1 y 10.')
  if (quantity && !serviceList().some((item) => String(item.id) === String(id)))
    throw new Error('El servicio ya no está disponible.')
  if (quantity) rows.push({ id, cantidad: quantity })
  localStorage.setItem(cartKey(), JSON.stringify(rows))
  notify()
}
export function addToCart(id) {
  setCartQuantity(
    id,
    Math.min(
      10,
      (readCart().find((row) => String(row.id) === String(id))?.cantidad || 0) +
        1,
    ),
  )
}
export function adoptGuestCart() {
  if (!readSession()) return
  const guest = arrayStored('nutrivida_compra_invitado')
  const available = serviceList()
  for (const row of guest.filter((item) =>
    available.some((service) => String(service.id) === String(item.id)),
  ))
    setCartQuantity(
      row.id,
      Math.min(
        10,
        (readCart().find((item) => String(item.id) === String(row.id))
          ?.cantidad || 0) + row.cantidad,
      ),
    )
  localStorage.removeItem('nutrivida_compra_invitado')
}
export function validateCheckout(values) {
  if (
    !values.nombre.trim() ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.correo.trim()) ||
    !/^\d{9}$/.test(values.telefono.trim()) ||
    !values.direccion.trim() ||
    !values.region.trim() ||
    !values.comuna.trim()
  )
    throw new Error(
      'Completa nombre, correo válido, teléfono de 9 dígitos, dirección, región y comuna.',
    )
  if (!['Presencial', 'Online'].includes(values.entrega))
    throw new Error('Selecciona la modalidad de atención.')
  if (!['aprobado', 'rechazado'].includes(values.resultado))
    throw new Error('Selecciona el resultado del pago de prueba.')
}
export function placeOrder(values, requestId) {
  validateCheckout(values)
  if (!requestId)
    throw new Error('No se pudo identificar la compra. Recarga el formulario.')
  const rows = cartDetails()
  const existing = arrayStored('nutrivida_ordenes').find(
    (order) =>
      order.solicitud === requestId &&
      order.correo ===
        (readSession()?.correo || values.correo.trim().toLowerCase()),
  )
  if (existing) return existing
  if (!rows.length || rows.some((row) => !row.service))
    throw new Error(
      'El carrito está vacío o contiene un servicio que ya no está disponible.',
    )
  const correo = readSession()?.correo || values.correo.trim().toLowerCase()
  const order = {
    id: crypto.randomUUID(),
    solicitud: requestId,
    fecha: new Date().toISOString(),
    correo,
    nombre: values.nombre.trim(),
    telefono: values.telefono.trim(),
    direccion: values.direccion.trim(),
    region: values.region,
    comuna: values.comuna,
    entrega: values.entrega,
    estado: values.resultado === 'aprobado' ? 'Pagada' : 'Rechazada',
    metodo: 'Pago simulado',
    items: rows.map((row) => ({
      id: row.id,
      titulo: row.service.titulo,
      cantidad: row.cantidad,
      precio: row.precio,
    })),
    total: rows.reduce((total, row) => total + row.cantidad * row.precio, 0),
  }
  const orders = arrayStored('nutrivida_ordenes')
  const cartBackup = localStorage.getItem(cartKey())
  // Revierte ambas escrituras si falla la persistencia antes de confirmar al usuario.
  try {
    localStorage.setItem(
      'nutrivida_ordenes',
      JSON.stringify([...orders, order]),
    )
    if (order.estado === 'Pagada') localStorage.setItem(cartKey(), '[]')
  } catch (error) {
    localStorage.setItem('nutrivida_ordenes', JSON.stringify(orders))
    if (cartBackup !== null) localStorage.setItem(cartKey(), cartBackup)
    throw error
  }
  if (!readSession())
    sessionStorage.setItem('nutrivida_compra_invitado_id', order.id)
  notify()
  return order
}
export function visibleOrders() {
  const session = readSession()
  return arrayStored('nutrivida_ordenes').filter(
    (order) =>
      authorizedSession() ||
      (session
        ? order.correo === session.correo
        : order.id === sessionStorage.getItem('nutrivida_compra_invitado_id')),
  )
}
