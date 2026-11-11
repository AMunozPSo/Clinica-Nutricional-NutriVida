import { beforeEach, describe, expect, it } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import App from '../App'
import { loginSession, readSession } from '../lib/storage'
import { readUsers } from '../lib/admin'
import {
  cancelMyAppointment,
  readMyAppointments,
  updateProfile,
} from '../lib/account'

const user = {
  nombre: 'Paciente Prueba',
  correo: 'paciente@gmail.com',
  password: 'paciente123',
  rol: 'paciente',
  telefono: '912345678',
  direccion: 'Dirección anterior 123',
  run: '12345678-9',
  region: 'La Araucanía',
  comuna: 'Temuco',
}
function seed(key, rows) {
  localStorage.setItem(key, JSON.stringify(rows))
}
function fill(label, value) {
  fireEvent.change(screen.getByLabelText(label, { exact: true }), {
    target: { value },
  })
}
beforeEach(() => {
  localStorage.clear()
  seed('nutrivida_usuarios', [user])
  loginSession(user.correo)
  window.history.replaceState({}, '', '/')
})

describe('Perfil y citas personales', () => {
  it('abre el perfil desde el saludo y conserva los cambios al volver a ingresar', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('link', { name: 'Hola Paciente Prueba' }))
    expect(
      screen.getByRole('heading', { name: 'Mi perfil' }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Correo electrónico')).toHaveAttribute(
      'readonly',
    )
    expect(screen.getByLabelText('RUN')).toHaveAttribute('readonly')
    fill('Nombre completo', 'Nombre Actualizado')
    fill('Teléfono', '987654321')
    fill('Dirección (calle y número)', 'Dirección nueva 456')
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(screen.getByRole('status')).toHaveTextContent(
      'Tus datos se guardaron correctamente.',
    )
    expect(
      screen.getByRole('link', { name: 'Hola Nombre Actualizado' }),
    ).toBeInTheDocument()
    expect(
      readUsers().find((item) => item.correo === user.correo),
    ).toMatchObject({
      nombre: 'Nombre Actualizado',
      telefono: '987654321',
      direccion: 'Dirección nueva 456',
      rol: 'paciente',
      password: 'paciente123',
    })
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar Sesión' }))
    fireEvent.click(screen.getByRole('link', { name: 'Iniciar Sesión' }))
    fill('Correo electrónico', user.correo)
    fill('Contraseña', user.password)
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))
    expect(
      screen.getByRole('link', { name: 'Hola Nombre Actualizado' }),
    ).toBeInTheDocument()
  })
  it('valida el teléfono y la dirección sin guardar datos inválidos', () => {
    window.history.replaceState({}, '', '/perfil')
    render(<App />)
    fill('Teléfono', '123')
    fill('Dirección (calle y número)', '   ')
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(
      screen.getByText('El teléfono debe tener 9 dígitos.'),
    ).toBeInTheDocument()
    expect(screen.getByText('La dirección es obligatoria.')).toBeInTheDocument()
    expect(
      readUsers().find((item) => item.correo === user.correo).telefono,
    ).toBe(user.telefono)
  })
  it('muestra únicamente las citas propias de ambos almacenes y filtra su estado', () => {
    seed('nutrivida_citas', [
      {
        id: 1,
        pacienteCorreo: user.correo,
        servicioNombre: 'Evaluación propia',
        fecha: '2026-11-02',
        hora: '10:00',
        doctor: 'Camila Rojas',
        estado: 'Pendiente',
      },
      {
        id: 2,
        pacienteCorreo: 'otra@gmail.com',
        servicioNombre: 'Servicio de otra persona',
        fecha: '2026-11-03',
        estado: 'Confirmada',
      },
    ])
    seed('nutrivida_carrito', [
      {
        id: 1,
        correo_usuario: user.correo,
        servicio: 'Evaluación propia',
        fecha: '2026-11-02',
        horario: '10:00',
        estado: 'Pendiente',
      },
      {
        id: 3,
        correo_usuario: user.correo,
        servicio: 'Taller anterior',
        fecha: '2026-10-10',
        horario: '11:00',
        estado: 'Completada',
      },
    ])
    render(<App />)
    fireEvent.click(screen.getByRole('link', { name: 'Mis citas' }))
    expect(screen.getByText('Evaluación propia')).toBeInTheDocument()
    expect(screen.getByText('Taller anterior')).toBeInTheDocument()
    expect(
      screen.queryByText('Servicio de otra persona'),
    ).not.toBeInTheDocument()
    expect(readMyAppointments()).toHaveLength(2)
    fill('Filtrar por estado', 'Completada')
    expect(screen.queryByText('Evaluación propia')).not.toBeInTheDocument()
    expect(screen.getByText('Taller anterior')).toBeInTheDocument()
    fill('Filtrar por estado', 'Cancelada')
    expect(
      screen.getByText('No tienes citas con este estado.'),
    ).toBeInTheDocument()
  })
  it('muestra un estado vacío y protege las dos rutas al cerrar sesión', () => {
    window.history.replaceState({}, '', '/citas')
    const view = render(<App />)
    expect(screen.getByText(/No tienes citas registradas/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar Sesión' }))
    view.unmount()
    window.history.replaceState({}, '', '/perfil')
    const profileView = render(<App />)
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument()
    profileView.unmount()
    window.history.replaceState({}, '', '/citas')
    render(<App />)
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument()
  })
  it('edita solo los datos de su cuenta y no permite modificar roles ni credenciales', () => {
    const other = { ...user, correo: 'otra@gmail.com', nombre: 'Otra persona' }
    seed('nutrivida_usuarios', [user, other])
    expect(
      updateProfile({
        ...user,
        nombre: 'Paciente Editado',
        correo: other.correo,
        esAdmin: true,
        rol: 'admin',
        password: 'otraClave',
      }),
    ).toEqual({})
    expect(readUsers().find((item) => item.correo === other.correo)).toEqual(
      other,
    )
    expect(
      readUsers().find((item) => item.correo === user.correo),
    ).toMatchObject({
      rol: 'paciente',
      password: user.password,
      nombre: 'Paciente Editado',
    })
    expect(readSession().esAdmin).toBe(false)
  })
  it('abre el perfil de Antonia desde el panel y mantiene su nombre editado en el próximo login', () => {
    loginSession('anto.munozp@duocuc.cl')
    window.history.replaceState({}, '', '/admin')
    render(<App />)
    fireEvent.click(
      screen.getByRole('link', { name: 'Hola Antonia · Mi perfil' }),
    )
    fill('Nombre completo', 'Antonia Muñoz')
    fill('Teléfono', '987654321')
    fill('Dirección (calle y número)', 'Calle Clínica 123')
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(readSession()).toMatchObject({
      nombre: 'Antonia Muñoz',
      esAdmin: true,
    })
    let restored
    act(() => {
      restored = loginSession('anto.munozp@duocuc.cl')
    })
    expect(restored.nombre).toBe('Antonia Muñoz')
  })
  it('cancela solo una cita propia y mantiene las citas de otras personas', () => {
    seed('nutrivida_citas', [
      {
        id: 10,
        pacienteCorreo: user.correo,
        servicioNombre: 'Consulta propia',
        fecha: '2026-11-02',
        hora: '10:00',
        estado: 'Pendiente',
      },
      {
        id: 11,
        pacienteCorreo: 'otra@gmail.com',
        servicioNombre: 'Consulta ajena',
        estado: 'Pendiente',
      },
    ])
    expect(() => cancelMyAppointment('nutrivida_citas:1')).toThrow(
      'No se puede',
    )
    window.history.replaceState({}, '', '/citas')
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar cita' }))
    fireEvent.click(
      screen.getByRole('button', { name: 'Confirmar cancelación' }),
    )
    expect(readMyAppointments()[0].estado).toBe('Cancelada')
    expect(JSON.parse(localStorage.getItem('nutrivida_citas'))[1].estado).toBe(
      'Pendiente',
    )
    expect(screen.getByRole('status')).toHaveTextContent('Cita cancelada')
  })
})
