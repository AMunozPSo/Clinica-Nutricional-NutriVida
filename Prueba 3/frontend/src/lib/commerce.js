import { data, mutate, request, refreshAfterSave, order, notice } from './api'
import { readSession, readServices } from './storage'

const cartKey = () => `nutrivida_cart_${readSession()?.id || 'guest'}`
export function readCart() {
  try { const rows = JSON.parse(localStorage.getItem(cartKey()) || '[]'); return Array.isArray(rows) ? rows : [] } catch { return [] }
}
const notify = () => window.dispatchEvent(new Event('nutrivida-data'))
export const readCategories = () => data.categories.filter(row => row.activo !== false)
export const saveCategory = value => mutate(value.id ? `/categorias/${value.id}` : '/categorias', { method: value.id ? 'PUT' : 'POST', body: { nombre: value.nombre, activo: true } })
export const deleteCategory = id => mutate(`/categorias/${id}`, { method: 'DELETE' })
export function salePrice(service) {
  const basisPoints = Math.round(Number(service.descuento || 0) * 100)
  return Math.floor((Number(service.precio) * (10000 - basisPoints) + 5000) / 10000)
}
export function cartDetails() {
  const services = readServices()
  return readCart().map(row => {
    const service = services.find(item => item.id === row.id)
    const precio = service ? salePrice(service) : 0
    return { ...row, service, precio, total: precio * row.cantidad }
  })
}
export function setCartQuantity(id, quantity) {
  const count = Number(quantity)
  if (!Number.isInteger(count) || count < 0 || count > 10) throw new Error('La cantidad debe estar entre 0 y 10.')
  const rows = readCart().filter(item => item.id !== id)
  if (count) {
    if (!readServices().some(item => item.id === id)) throw new Error('El servicio ya no está disponible.')
    rows.push({ id, cantidad: count })
  }
  localStorage.setItem(cartKey(), JSON.stringify(rows))
  notify()
}
export function addToCart(id) { setCartQuantity(id, Math.min(10, (readCart().find(item => item.id === id)?.cantidad || 0) + 1)) }
export function adoptGuestCart() {
  if (!readSession()) return
  const guest = JSON.parse(localStorage.getItem('nutrivida_cart_guest') || '[]')
  for (const row of guest) if (readServices().some(item => item.id === row.id)) setCartQuantity(row.id, Math.min(10, (readCart().find(item => item.id === row.id)?.cantidad || 0) + row.cantidad))
  localStorage.removeItem('nutrivida_cart_guest')
}
export function validateCheckout(values) {
  if (!values.nombre.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.correo.trim()) || !/^\d{9}$/.test(values.telefono.trim()) || !values.direccion.trim() || !values.region.trim() || !values.comuna.trim()) throw new Error('Completa tus datos y un teléfono de 9 dígitos.')
  if (!['Presencial', 'Online'].includes(values.entrega) || !['aprobado', 'rechazado'].includes(values.resultado)) throw new Error('Selecciona modalidad y resultado del pago de prueba.')
}
export async function placeOrder(values, requestId) {
  validateCheckout(values)
  const rows = cartDetails()
  if (!rows.length || rows.some(row => !row.service)) throw new Error('El carrito está vacío o tiene un servicio no disponible.')
  const headers = { 'Idempotency-Key': requestId }
  const guest = !readSession()
  let guestKey = ''
  if (guest) {
    guestKey = sessionStorage.getItem(`nutrivida_checkout_key_${requestId}`) || crypto.randomUUID() + crypto.randomUUID()
    sessionStorage.setItem(`nutrivida_checkout_key_${requestId}`, guestKey)
    headers['X-Pedido-Key'] = guestKey
  }
  const result = order(await request('/pedidos', { method: 'POST', headers, body: { ...values, items: rows.map(row => ({ id: row.id, cantidad: row.cantidad })), entrega: values.entrega.toUpperCase(), resultado: values.resultado.toUpperCase() } }))
  data.orders = [result, ...data.orders.filter(row => row.id !== result.id)]
  try {
    if (guest) {
      sessionStorage.setItem(`nutrivida_compra_key_${result.id}`, guestKey)
      sessionStorage.setItem('nutrivida_ultima_compra', result.id)
      sessionStorage.removeItem(`nutrivida_checkout_key_${requestId}`)
    }
    if (result.estado === 'Pagada') localStorage.setItem(cartKey(), '[]')
  } catch { notice('La compra se registró. Guarda el comprobante antes de cerrar esta pestaña.') }
  notify()
  await refreshAfterSave()
  return result
}
export const visibleOrders = () => data.orders
