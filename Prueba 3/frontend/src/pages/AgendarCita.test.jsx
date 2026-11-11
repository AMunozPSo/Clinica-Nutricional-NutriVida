import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import App from '../App'
import { loginSession } from '../lib/storage'
import { availableTimes, bookAppointment } from '../lib/booking'
import { readMyAppointments } from '../lib/account'
import { readAppointments, serviceList, statistics } from '../lib/admin'

const user = {
  nombre: 'Paciente Prueba',
  correo: 'paciente@gmail.com',
  password: 'paciente123',
  rol: 'paciente',
}
function nextWeekday() {
  const date = new Date()
  date.setUTCDate(date.getUTCDate() + 7)
  while ([0, 6].includes(date.getUTCDay()))
    date.setUTCDate(date.getUTCDate() + 1)
  return date.toISOString().slice(0, 10)
}
function fill(label, value) {
  fireEvent.change(screen.getByLabelText(label, { exact: true }), {
    target: { value },
  })
}
beforeEach(() => {
  localStorage.clear()
  localStorage.setItem('nutrivida_usuarios', JSON.stringify([user]))
  loginSession(user.correo)
  window.history.replaceState({}, '', '/catalogo')
})

describe('Agendamiento completo', () => {
  it('guarda desde el catálogo, muestra la cita en Mis citas y la conserva al recargar', () => {
    const view = render(<App />)
    fireEvent.click(screen.getAllByRole('button', { name: 'Ver Detalles' })[0])
    fireEvent.click(screen.getByRole('button', { name: 'Agendar cita' }))
    expect(
      screen.getByRole('heading', { name: 'Agendar cita' }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Servicio')).toHaveValue('1')
    expect(screen.getByLabelText('Profesional')).toHaveValue('Camila Rojas')
    fill('Fecha', nextWeekday())
    fill('Hora', '10:00')
    fill('Motivo de consulta (opcional)', 'Primera evaluación')
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar cita' }))
    expect(screen.getByRole('status')).toHaveTextContent(
      '¡Cita agendada con éxito!',
    )
    const saved = JSON.parse(localStorage.getItem('nutrivida_citas'))
    expect(saved).toHaveLength(1)
    expect(saved[0]).toMatchObject({
      pacienteCorreo: user.correo,
      pacienteNombre: user.nombre,
      servicioId: 1,
      fecha: nextWeekday(),
      hora: '10:00',
      estado: 'Pendiente',
      precio: 25000,
    })
    fireEvent.click(screen.getByRole('button', { name: 'Ver mis citas' }))
    expect(screen.getByText('Evaluación Nutricional')).toBeInTheDocument()
    expect(screen.getByText('Primera evaluación')).toBeInTheDocument()
    view.unmount()
    render(<App />)
    expect(screen.getByText('Evaluación Nutricional')).toBeInTheDocument()
    expect(readMyAppointments()).toHaveLength(1)
  })
  it('la reserva nueva aparece en el gestor de citas del administrador', () => {
    bookAppointment({
      servicioId: 1,
      fecha: nextWeekday(),
      hora: '10:00',
      motivo: 'Consulta de prueba',
    })
    loginSession('feli.arayah@duocuc.cl')
    window.history.replaceState({}, '', '/admin/citas')
    render(<App />)
    expect(screen.getByText('Paciente Prueba')).toBeInTheDocument()
    expect(screen.getByText('Evaluación Nutricional')).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText(/Cambiar estado de cita/), {
      target: { value: 'Completada' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar cambio' }))
    expect(statistics([], readAppointments(), serviceList())).toMatchObject({
      income: 25000,
      completed: 1,
    })
  })
  it('rechaza el pasado, fines de semana y horarios no disponibles sin crear citas', () => {
    expect(() =>
      bookAppointment({ servicioId: 1, fecha: '2000-01-03', hora: '10:00' }),
    ).toThrow('lunes a viernes')
    expect(() =>
      bookAppointment({ servicioId: 1, fecha: nextWeekday(), hora: '23:00' }),
    ).toThrow('horario disponible')
    expect(readAppointments()).toHaveLength(0)
    expect(availableTimes(1, '2000-01-03')).toEqual([])
  })
  it('impide reservar dos veces o solapar citas del mismo profesional', () => {
    const values = { servicioId: 1, fecha: nextWeekday(), hora: '10:00' }
    bookAppointment(values)
    expect(() => bookAppointment(values)).toThrow('horario disponible')
    expect(availableTimes(1, values.fecha)).not.toContain('09:30')
    expect(availableTimes(1, values.fecha)).not.toContain('10:30')
    expect(availableTimes(1, values.fecha)).toContain('11:00')
    expect(readAppointments()).toHaveLength(1)
  })
  it('regresa al servicio elegido después de iniciar sesión', () => {
    localStorage.removeItem('nutrivida_sesion')
    localStorage.removeItem('adminLogueado')
    window.history.replaceState({}, '', '/agendar?servicio=2')
    render(<App />)
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument()
    fill('Correo electrónico', user.correo)
    fill('Contraseña', user.password)
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))
    expect(
      screen.getByRole('heading', { name: 'Agendar cita' }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Servicio')).toHaveValue('2')
  })
  it('no muestra éxito si falla el almacenamiento', () => {
    window.history.replaceState({}, '', '/agendar?servicio=1')
    render(<App />)
    fill('Fecha', nextWeekday())
    fill('Hora', '10:00')
    const spy = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('Almacenamiento lleno')
      })
    try {
      fireEvent.click(screen.getByRole('button', { name: 'Confirmar cita' }))
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Almacenamiento lleno',
      )
      expect(
        screen.queryByText(/¡Cita agendada con éxito!/),
      ).not.toBeInTheDocument()
      expect(localStorage.getItem('nutrivida_citas')).toBeNull()
    } finally {
      spy.mockRestore()
    }
  })
  it('actualiza las horas disponibles si otra pestaña guarda una cita', () => {
    window.history.replaceState({}, '', '/agendar?servicio=1')
    render(<App />)
    fill('Fecha', nextWeekday())
    expect(screen.getByRole('option', { name: '10:00' })).toBeInTheDocument()
    act(() =>
      bookAppointment({ servicioId: 1, fecha: nextWeekday(), hora: '10:00' }),
    )
    expect(
      screen.queryByRole('option', { name: '10:00' }),
    ).not.toBeInTheDocument()
  })
})
