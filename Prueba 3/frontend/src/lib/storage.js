import { data, signIn, signOut } from './api'

export function readStored(key, fallback) {
  const values = {
    nutrivida_usuarios: data.users, usuarios: data.users,
    serviciosNutriVida: data.services, nutrivida_servicios: data.services,
    nutrivida_citas: data.appointments, nutrivida_ordenes: data.orders,
    nutrivida_planes: data.plans, nutrivida_progreso: data.progress,
    nutrivida_categorias: data.categories, nutrivida_mensajes: data.messages,
  }
  if (Object.hasOwn(values, key)) return values[key]
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}
export const readSession = () => data.session
export const loginSession = (correo, password) => signIn(correo, password)
export const logoutSession = () => signOut()
export const readServices = () => data.services.filter(service => service.activo !== false)
