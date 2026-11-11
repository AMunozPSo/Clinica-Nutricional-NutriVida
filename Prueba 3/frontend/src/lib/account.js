import { data, request, updateSession, refreshAfterSave, mutate } from './api'
import { readSession } from './storage'
export const readProfile = () => readSession()
export async function updateProfile(values) {
  const session = readSession()
  if (!session) throw new Error('Inicia sesión nuevamente.')
  try {
    const user = await request(`/usuarios/${session.id}`, { method: 'PUT', body: values })
    updateSession(user)
    await refreshAfterSave()
    return {}
  } catch (error) { if (Object.keys(error.fields || {}).length) return error.fields; throw error }
}
export const readMyAppointments = () => data.appointments.filter(item => item.pacienteId === readSession()?.id)
export async function cancelMyAppointment(id) { return mutate(`/citas/${id}`, { method: 'DELETE' }) }
export async function rescheduleMyAppointment(id, values) { return mutate(`/citas/${id}`, { method: 'PUT', body: values }) }
