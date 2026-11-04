import { arrayStored, readAppointments, readUsers } from './admin'
import { readSession } from './storage'
import { LOCATIONS } from './registration'

export function readProfile() {
  const session = readSession()
  return session
    ? readUsers().find((user) => user.correo === session.correo) || null
    : null
}
export function updateProfile(values) {
  const session = readSession()
  const users = readUsers()
  const current = users.find((user) => user.correo === session?.correo)
  if (!session || !current)
    throw new Error('Inicia sesión nuevamente para editar tu perfil.')
  const errors = {}
  if (!values.nombre.trim()) errors.nombre = 'El nombre es obligatorio.'
  if (!/^\d{9}$/.test(values.telefono.trim()))
    errors.telefono = 'El teléfono debe tener 9 dígitos.'
  if (!values.direccion.trim())
    errors.direccion = 'La dirección es obligatoria.'
  if (values.region || values.comuna) {
    if (!LOCATIONS[values.region]) errors.region = 'Selecciona una región.'
    if (!LOCATIONS[values.region]?.includes(values.comuna))
      errors.comuna = 'Selecciona una comuna de la región elegida.'
  }
  if (Object.keys(errors).length) return errors
  // Solo actualiza los datos editables de la cuenta de la sesión actual.
  const updated = {
    ...current,
    nombre: values.nombre.trim(),
    telefono: values.telefono.trim(),
    direccion: values.direccion.trim(),
    region: values.region,
    comuna: values.comuna,
  }
  const next = users.map((user) =>
    user.correo === session.correo ? updated : user,
  )
  localStorage.setItem('nutrivida_usuarios', JSON.stringify(next))
  if (localStorage.getItem('usuarios') !== null)
    localStorage.setItem('usuarios', JSON.stringify(next))
  localStorage.setItem(
    'nutrivida_sesion',
    JSON.stringify({ ...session, nombre: updated.nombre }),
  )
  window.dispatchEvent(new Event('nutrivida-data'))
  window.dispatchEvent(new Event('nutrivida-session'))
  return {}
}
export function readMyAppointments() {
  const session = readSession()
  if (!session) return []
  return readAppointments()
    .filter(
      (item) =>
        item.pacienteCorreo.trim().toLowerCase() ===
        session.correo.trim().toLowerCase(),
    )
    .sort((a, b) =>
      `${b.fecha || ''} ${b.hora}`.localeCompare(`${a.fecha || ''} ${a.hora}`),
    )
}

export function cancelMyAppointment(uid) {
  const appointment = readMyAppointments().find((item) => item.uid === uid)
  if (!appointment || ['Cancelada', 'Completada'].includes(appointment.estado))
    throw new Error('No se puede cancelar esta cita.')
  for (const ref of appointment.refs) {
    const rows = arrayStored(ref.key)
    rows[ref.index] = { ...rows[ref.index], estado: 'Cancelada' }
    localStorage.setItem(ref.key, JSON.stringify(rows))
  }
  window.dispatchEvent(new Event('nutrivida-data'))
}
