import {
  amount,
  arrayStored,
  readAppointments,
  readUsers,
  serviceList,
  today,
} from './admin'
import { readSession } from './storage'

const minutes = (time) =>
  Number(time.split(':')[0]) * 60 + Number(time.split(':')[1])
function currentTime() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'America/Santiago',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date())
  return (
    Number(parts.find((part) => part.type === 'hour').value) * 60 +
    Number(parts.find((part) => part.type === 'minute').value)
  )
}
export function validBookingDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false
  const parsed = new Date(`${date}T12:00:00Z`)
  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === date &&
    date >= today() &&
    ![0, 6].includes(parsed.getUTCDay())
  )
}
export function availableTimes(
  serviceId,
  date,
  appointments = readAppointments(),
) {
  const service = serviceList().find(
    (item) => String(item.id) === String(serviceId),
  )
  if (!service?.doctor || !validBookingDate(date)) return []
  const duration = Number(service.duracion) || 45
  const occupied = appointments.filter(
    (item) =>
      item.fecha === date &&
      item.estado !== 'Cancelada' &&
      (item.doctor || '').trim().toLowerCase() ===
        service.doctor.trim().toLowerCase() &&
      /^\d{2}:\d{2}$/.test(item.hora),
  )
  return Array.from({ length: 20 }, (_, index) => 9 * 60 + index * 30)
    .filter((start) => {
      if (
        start + duration > 19 * 60 ||
        (date === today() && start <= currentTime())
      )
        return false
      return !occupied.some((item) => {
        const linked = serviceList().find(
          (candidate) => String(candidate.id) === String(item.servicioId),
        )
        const end =
          minutes(item.hora) +
          (Number(item.duracion) || Number(linked?.duracion) || 45)
        return start < end && start + duration > minutes(item.hora)
      })
    })
    .map(
      (value) =>
        `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`,
    )
}
export function bookAppointment(values) {
  const session = readSession()
  if (!session || !readUsers().some((user) => user.correo === session.correo))
    throw new Error('Inicia sesión para agendar una cita.')
  const service = serviceList().find(
    (item) => String(item.id) === String(values.servicioId),
  )
  if (!service) throw new Error('Selecciona un servicio disponible.')
  if (!service.doctor?.trim())
    throw new Error(
      'Este servicio todavía no tiene un profesional asignado. Contáctanos para coordinar tu atención.',
    )
  if (!validBookingDate(values.fecha))
    throw new Error(
      'Selecciona una fecha de lunes a viernes que no sea anterior a hoy.',
    )
  if (!availableTimes(service.id, values.fecha).includes(values.hora))
    throw new Error(
      'Selecciona un horario disponible. La hora elegida puede estar ocupada o haber pasado.',
    )
  if ((values.motivo || '').length > 500)
    throw new Error(
      'El motivo de consulta debe tener como máximo 500 caracteres.',
    )
  const appointment = {
    id: crypto.randomUUID(),
    pacienteNombre: session.nombre,
    pacienteCorreo: session.correo,
    servicioId: service.id,
    servicioNombre: service.titulo,
    doctor: service.doctor,
    doctorCorreo:
      readUsers().find(
        (user) =>
          user.nombre
            ?.replace(/^(Dr[.]?|Dra[.]?) /i, '')
            .trim()
            .toLowerCase() ===
          service.doctor
            .replace(/^(Dr[.]?|Dra[.]?) /i, '')
            .trim()
            .toLowerCase(),
      )?.correo || '',
    fecha: values.fecha,
    hora: values.hora,
    motivo: (values.motivo || '').trim(),
    modalidad: service.modalidad,
    duracion: Number(service.duracion) || 45,
    precio: amount(service.precio),
    estado: 'Pendiente',
  }
  localStorage.setItem(
    'nutrivida_citas',
    JSON.stringify([...arrayStored('nutrivida_citas'), appointment]),
  )
  window.dispatchEvent(new Event('nutrivida-data'))
  return appointment
}
