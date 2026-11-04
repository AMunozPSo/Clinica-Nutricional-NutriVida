import { arrayStored, readAppointments, readUsers, role, today } from './admin'
import { readSession } from './storage'
const normalize = (value) =>
  (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/^(dr|dra)[. ]+/i, '')
    .trim()
    .toLowerCase()
export function doctorAppointments() {
  const session = readSession()
  if (!session || (!session.esAdmin && session.rol !== 'medico')) return []
  return readAppointments().filter(
    (item) =>
      session.esAdmin ||
      (item.doctorCorreo
        ? item.doctorCorreo === session.correo
        : normalize(item.doctor || item.nutricionista) ===
          normalize(session.nombre)),
  )
}
export function readProgress() {
  const session = readSession()
  return session
    ? arrayStored('nutrivida_progreso')
        .filter((row) => row.correo === session.correo)
        .sort((a, b) => a.fecha.localeCompare(b.fecha))
    : []
}
export function saveProgress(values) {
  const session = readSession()
  if (!session) throw new Error('Debes iniciar sesión.')
  const date = new Date(`${values.fecha}T12:00:00Z`)
  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== values.fecha ||
    values.fecha > today()
  )
    throw new Error('Selecciona una fecha válida que no sea futura.')
  if (
    !Number.isFinite(Number(values.peso)) ||
    Number(values.peso) < 20 ||
    Number(values.peso) > 300
  )
    throw new Error('Ingresa un peso entre 20 y 300 kg.')
  if (readProgress().some((row) => row.fecha === values.fecha))
    throw new Error('Ya tienes un registro para esta fecha.')
  localStorage.setItem(
    'nutrivida_progreso',
    JSON.stringify([
      ...arrayStored('nutrivida_progreso'),
      {
        id: crypto.randomUUID(),
        correo: session.correo,
        fecha: values.fecha,
        peso: Number(values.peso),
      },
    ]),
  )
  window.dispatchEvent(new Event('nutrivida-data'))
}
export function deleteProgress(id) {
  const session = readSession()
  if (!session) throw new Error('Debes iniciar sesión.')
  localStorage.setItem(
    'nutrivida_progreso',
    JSON.stringify(
      arrayStored('nutrivida_progreso').filter(
        (row) => row.id !== id || row.correo !== session.correo,
      ),
    ),
  )
  window.dispatchEvent(new Event('nutrivida-data'))
}
export function readPlans() {
  const session = readSession()
  return session
    ? arrayStored('nutrivida_planes').filter(
        (row) => row.correo === session.correo,
      )
    : []
}
export function planPatients() {
  const session = readSession()
  if (!session || (!session.esAdmin && session.rol !== 'medico')) return []
  const emails = doctorAppointments().map((row) => row.pacienteCorreo)
  return readUsers().filter(
    (user) =>
      role(user) === 'paciente' &&
      (session.esAdmin || emails.includes(user.correo)),
  )
}
export function assignPlan(values) {
  const session = readSession()
  if (
    !planPatients().some((user) => user.correo === values.correo) ||
    !values.titulo.trim() ||
    !values.contenido.trim()
  )
    throw new Error(
      'Selecciona un paciente de tu agenda y completa el título y contenido del plan.',
    )
  const plans = arrayStored('nutrivida_planes').filter(
    (row) => row.correo !== values.correo,
  )
  plans.push({
    id: crypto.randomUUID(),
    correo: values.correo,
    titulo: values.titulo.trim(),
    contenido: values.contenido.trim(),
    profesional: session.nombre,
    fecha: today(),
  })
  localStorage.setItem('nutrivida_planes', JSON.stringify(plans))
  window.dispatchEvent(new Event('nutrivida-data'))
}
