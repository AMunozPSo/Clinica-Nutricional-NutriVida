import { data, mutate } from './api'
import { readSession } from './storage'
export const doctorAppointments = () => data.appointments.filter(item => readSession()?.esAdmin || item.profesionalId === readSession()?.id)
export const planPatients = () => data.patients
export const readProgress = () => data.progress
export const readPlans = () => data.plans.filter(item => item.activo && item.pacienteId === readSession()?.id)
export const saveProgress = values => mutate('/progreso', { method: 'POST', body: { ...values, peso: Number(values.peso) } })
export const deleteProgress = id => mutate(`/progreso/${id}`, { method: 'DELETE' })
export const assignPlan = values => mutate('/planes', { method: 'POST', body: values })
