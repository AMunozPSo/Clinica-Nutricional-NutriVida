import { request, mutate, appointment } from './api'
import { today } from './admin'
export function validBookingDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false
  const parsed = new Date(`${date}T12:00:00Z`)
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date && date >= today() && ![0, 6].includes(parsed.getUTCDay())
}
export async function availableTimes(serviceId, date) {
  if (!serviceId || !validBookingDate(date)) return []
  return request(`/citas/disponibilidad?servicioId=${encodeURIComponent(serviceId)}&fecha=${encodeURIComponent(date)}`)
}
export async function bookAppointment(values) { return appointment(await mutate('/citas', { method: 'POST', body: values })) }
