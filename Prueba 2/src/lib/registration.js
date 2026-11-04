import { readUsers } from './admin'
import { validateUser } from './rules'
export { LOCATIONS } from './rules'
export function validateRegistration(values) {
  return validateUser(values, readUsers())
}
export function registerUser(values) {
  const errors = validateRegistration(values)
  if (Object.keys(errors).length) return errors
  const data = { ...values }
  const user = {
    ...data,
    nombre: values.nombre.trim(),
    apellidos: values.apellidos.trim(),
    run: values.run.trim().toUpperCase(),
    correo: values.correo.trim().toLowerCase(),
    direccion: values.direccion.trim(),
    telefono: values.telefono.trim(),
    rol: 'paciente',
    esAdmin: false,
  }
  delete user.confirmPassword
  localStorage.setItem(
    'nutrivida_usuarios',
    JSON.stringify([...readUsers(), user]),
  )
  window.dispatchEvent(new Event('nutrivida-data'))
  return {}
}
