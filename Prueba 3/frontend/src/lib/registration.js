import { request } from './api'

export const LOCATIONS = {
  Valparaíso: ['Villa Alemana', 'Quilpué', 'Viña del Mar', 'Valparaíso'],
  Metropolitana: ['Santiago', 'Providencia', 'Ñuñoa', 'Maipú'],
  Biobío: ['Concepción', 'Talcahuano', 'Los Ángeles'],
  'La Araucanía': ['Temuco', 'Padre Las Casas', 'Villarrica', 'Angol'],
}


export const EMAIL_PATTERN = /^[^\s@]+@(duocuc\.cl|duoc\.cl|profesor\.duoc\.cl|gmail\.com|hotmail\.com|clinnutrivida\.cl)$/i
export function validateRegistration(values) {
  const errors = {}
  for (const key of ['nombres', 'apellidos', 'direccion']) if (!values[key]?.trim()) errors[key] = 'Completa este campo.'
  if (!/^\d{7,8}-[\dK]$/i.test(values.run?.trim() || '')) errors.run = 'Ingresa el RUN sin puntos y con guion.'
  if (!/^\d{9}$/.test(values.telefono?.trim() || '')) errors.telefono = 'El teléfono debe tener 9 dígitos.'
  if (!EMAIL_PATTERN.test(values.correo?.trim() || '')) errors.correo = 'Usa un correo Duoc, Gmail, Hotmail o de la clínica.'
  if ((values.password || '').length < 8 || new TextEncoder().encode(values.password || '').length > 72) errors.password = 'La contraseña requiere al menos 8 caracteres y hasta 72 bytes.'
  if (values.password !== values.confirmPassword) errors.confirmPassword = 'Las contraseñas no coinciden.'
  if (!LOCATIONS[values.region]) errors.region = 'Selecciona una región.'
  if (!LOCATIONS[values.region]?.includes(values.comuna)) errors.comuna = 'Selecciona una comuna de la región elegida.'
  return errors
}
export async function registerUser(values) {
  const errors = validateRegistration(values)
  if (Object.keys(errors).length) return errors
  try {
    await request('/auth/registro', { method: 'POST', body: { ...values, correo: values.correo.trim().toLowerCase(), run: values.run.trim().toUpperCase() }, anonymous: true })
    return {}
  } catch (error) { if (Object.keys(error.fields || {}).length) return error.fields; throw error }
}
