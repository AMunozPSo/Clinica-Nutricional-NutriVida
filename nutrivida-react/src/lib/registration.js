import { readUsers } from './admin'

export const LOCATIONS = {
  Valparaíso: ['Villa Alemana', 'Quilpué', 'Viña del Mar', 'Valparaíso'],
  Metropolitana: ['Santiago', 'Providencia', 'Ñuñoa', 'Maipú'],
  Biobío: ['Concepción', 'Talcahuano', 'Los Ángeles'],
  'La Araucanía': ['Temuco', 'Padre Las Casas', 'Villarrica', 'Angol'],
}

export function validateRegistration(values) {
  const errors = {}
  const correo = values.correo.trim().toLowerCase()
  const run = values.run.trim().toUpperCase()
  if (!values.nombre.trim()) errors.nombre = 'El nombre es obligatorio.'
  if (!/^\d{7,8}-[\dK]$/.test(run))
    errors.run =
      'Ingresa un RUN sin puntos y con guion, por ejemplo 12345678-9.'
  if (!/^\d{9}$/.test(values.telefono.trim()))
    errors.telefono = 'El teléfono debe tener 9 dígitos.'
  if (
    !/^[^\s@]+@(duocuc\.cl|duoc\.cl|profesor\.duoc\.cl|gmail\.com|hotmail\.com|clinnutrivida\.cl)$/.test(
      correo,
    )
  )
    errors.correo =
      'Solo se aceptan correos institucionales (Duoc), Gmail, Hotmail o Clínicos.'
  if (values.password.trim().length < 6)
    errors.password = 'La contraseña debe tener al menos 6 caracteres.'
  if (values.password !== values.confirmPassword)
    errors.confirmPassword = 'Las contraseñas no coinciden.'
  if (!values.direccion.trim())
    errors.direccion = 'La dirección es obligatoria.'
  if (!LOCATIONS[values.region]) errors.region = 'Selecciona una región.'
  if (!LOCATIONS[values.region]?.includes(values.comuna))
    errors.comuna = 'Selecciona una comuna de la región elegida.'
  const users = readUsers()
  if (users.some((user) => user.correo === correo))
    errors.correo = 'Ya existe una cuenta registrada con este correo.'
  if (users.some((user) => user.run?.replaceAll('.', '').toUpperCase() === run))
    errors.run = 'Ya existe una cuenta registrada con este RUN.'
  return errors
}

export function registerUser(values) {
  const errors = validateRegistration(values)
  if (Object.keys(errors).length) return errors
  const correo = values.correo.trim().toLowerCase()
  const user = {
    nombre: values.nombre.trim(),
    run: values.run.trim().toUpperCase(),
    telefono: values.telefono.trim(),
    correo,
    password: values.password,
    direccion: values.direccion.trim(),
    region: values.region,
    comuna: values.comuna,
    rol: correo.endsWith('@clinnutrivida.cl') ? 'medico' : 'paciente',
    esAdmin: false,
  }
  localStorage.setItem(
    'nutrivida_usuarios',
    JSON.stringify([...readUsers(), user]),
  )
  window.dispatchEvent(new Event('nutrivida-data'))
  return {}
}
