import { data, mutate } from './api'
import { readSession, readStored } from './storage'

export const BASE_ADMINS = []
export const CATEGORIES = {}
export const STATES = ['Pendiente', 'Confirmada', 'Completada', 'Cancelada']
export const arrayStored = key => {
  const value = readStored(key, [])
  return Array.isArray(value) ? value : []
}
export const amount = value => typeof value === 'number' ? value : Number(String(value ?? 0).replaceAll('.', '').replace(/[^0-9-]/g, '')) || 0
export const money = value => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount(value))
export const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Santiago', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
export const role = user => user.rol || 'paciente'
export const readUsers = () => data.users
export const serviceList = () => data.services
export const readAppointments = () => data.appointments
export const authorizedSession = () => readSession()?.esAdmin ? readSession() : null
function requireAdmin() { if (!authorizedSession()) throw new Error('No tienes permisos para realizar esta acción.') }

export async function createUser(values) {
  requireAdmin()
  const { rol = 'paciente', ...datos } = values
  return mutate('/usuarios', { method: 'POST', body: { datos, rol: rol.toUpperCase() } })
}
export async function editUser(correo, values) {
  requireAdmin()
  const user = data.users.find(item => item.correo === correo)
  if (!user) throw new Error('Usuario no encontrado.')
  return mutate(`/usuarios/${user.id}`, { method: 'PUT', body: {
    nombres: values.nombres, apellidos: values.apellidos, telefono: values.telefono,
    direccion: values.direccion, region: values.region, comuna: values.comuna,
  } })
}
export async function changeUser(correo, action) {
  requireAdmin()
  const user = data.users.find(item => item.correo === correo)
  if (!user) throw new Error('Usuario no encontrado.')
  if (action === 'delete') return mutate(`/usuarios/${user.id}`, { method: 'DELETE' })
  return mutate(`/usuarios/${user.id}/permisos`, { method: 'PUT', body: {
    rol: action === 'promote' ? 'ADMIN' : action === 'medico' ? 'MEDICO' : action === 'vendedor' ? 'VENDEDOR' : action === 'demote' ? 'PACIENTE' : user.rol.toUpperCase(),
    activo: action === 'activate' ? true : user.activo,
  } })
}
export async function saveService(value) {
  requireAdmin()
  return mutate(value.id ? `/servicios/${value.id}` : '/servicios', { method: value.id ? 'PUT' : 'POST', body: {
    idCategoria: value.categoria, profesionalId: value.profesionalId || null,
    titulo: value.titulo, descripcion: value.descripcion, precio: amount(value.precio),
    descuento: Number(value.descuento || 0), modalidad: value.modalidad.toUpperCase(),
    duracion: Number(value.duracion), imagen: value.imagen || '/consulta.jpg', activo: value.activo !== false,
  } })
}
export async function deleteService(id) { requireAdmin(); return mutate(`/servicios/${id}`, { method: 'DELETE' }) }
export async function changeAppointment(id, estado) {
  return mutate(`/citas/${id}/estado`, { method: 'PUT', body: { estado: estado.toUpperCase() } })
}
export function statistics(users, appointments) {
  const completed = appointments.filter(item => item.estado === 'Completada')
  return {
    patients: users.filter(user => role(user) === 'paciente' && user.activo !== false).length,
    income: completed.reduce((total, row) => total + amount(row.precio), 0),
    completed: completed.length,
    pending: appointments.filter(row => row.estado === 'Pendiente').length,
    today: appointments.filter(row => row.fecha === today() && row.estado !== 'Cancelada').length,
    plans: data.plans.filter(plan => plan.activo).length,
  }
}
