import { beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import App from '../App'
import { authorizedSession, readUsers } from '../lib/admin'
import { readSession } from '../lib/storage'
import { registerUser } from '../lib/registration'

const values = {
  nombre: 'Persona Prueba',
  run: '12345678-9',
  telefono: '912345678',
  correo: 'persona@gmail.com',
  password: 'prueba123',
  confirmPassword: 'prueba123',
  direccion: 'Calle Prueba 123',
  region: 'La Araucanía',
  comuna: 'Temuco',
}
function fill(label, value) {
  fireEvent.change(screen.getByLabelText(label, { exact: true }), {
    target: { value },
  })
}
function fillRegistration() {
  fill('Nombre completo', values.nombre)
  fill('RUN', values.run)
  fill('Teléfono', values.telefono)
  fill('Correo electrónico', values.correo)
  fill('Contraseña', values.password)
  fill('Repetir contraseña', values.confirmPassword)
  fill('Dirección (calle y número)', values.direccion)
  fill('Región', values.region)
  fill('Comuna', values.comuna)
}
beforeEach(() => {
  localStorage.clear()
  window.history.replaceState({}, '', '/login')
})
describe('Registro e inicio de sesión de usuarios', () => {
  it('permite llegar desde el login, registrarse e ingresar sin privilegios administrativos', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('link', { name: 'Registrarse' }))
    expect(
      screen.getByRole('heading', { name: 'Crear una cuenta' }),
    ).toBeInTheDocument()
    fillRegistration()
    fireEvent.click(screen.getByRole('button', { name: 'Registrarme' }))
    expect(screen.getByRole('status')).toHaveTextContent('¡Registro exitoso!')
    expect(
      readUsers().find((user) => user.correo === values.correo),
    ).toMatchObject({
      nombre: values.nombre,
      rol: 'paciente',
      esAdmin: false,
      comuna: 'Temuco',
    })
    expect(
      readUsers().find((user) => user.correo === values.correo),
    ).not.toHaveProperty('confirmPassword')
    fill('Correo electrónico', values.correo)
    fill('Contraseña', values.password)
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))
    expect(screen.getByText('Hola Persona Prueba')).toBeInTheDocument()
    expect(readSession()).toMatchObject({ esAdmin: false, rol: 'paciente' })
    expect(authorizedSession()).toBeNull()
    expect(localStorage.getItem('adminLogueado')).toBeNull()
    expect(
      screen.queryByRole('link', { name: 'Ir al Panel' }),
    ).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar Sesión' }))
    expect(readSession()).toBeNull()
  })
  it('valida los campos obligatorios, el teléfono, el RUN y la confirmación', () => {
    window.history.replaceState({}, '', '/registro')
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Registrarme' }))
    expect(screen.getByText('El nombre es obligatorio.')).toBeInTheDocument()
    expect(
      screen.getByText('El teléfono debe tener 9 dígitos.'),
    ).toBeInTheDocument()
    expect(screen.getByText(/Ingresa un RUN sin puntos/)).toBeInTheDocument()
    fillRegistration()
    fill('Repetir contraseña', 'otraClave')
    fireEvent.click(screen.getByRole('button', { name: 'Registrarme' }))
    expect(
      screen.getByText('Las contraseñas no coinciden.'),
    ).toBeInTheDocument()
    expect(localStorage.getItem('nutrivida_usuarios')).toBeNull()
  })
  it('rechaza duplicados y dominios inválidos y asigna el rol médico sin conceder admin', () => {
    expect(registerUser(values)).toEqual({})
    expect(
      registerUser({ ...values, correo: 'PERSONA@GMAIL.COM' }),
    ).toHaveProperty('correo')
    expect(
      registerUser({ ...values, correo: 'otra@gmail.com' }),
    ).toHaveProperty('run')
    expect(
      registerUser({
        ...values,
        correo: 'otra@dominio.example',
        run: '11111111-1',
      }),
    ).toHaveProperty('correo')
    expect(
      registerUser({
        ...values,
        correo: 'medico@clinnutrivida.cl',
        run: '11111111-1',
      }),
    ).toEqual({})
    expect(
      readUsers().find((user) => user.correo === 'medico@clinnutrivida.cl'),
    ).toMatchObject({ rol: 'medico', esAdmin: false })
  })
  it('reinicia la comuna al cambiar de región y protege el panel de una cuenta paciente', () => {
    window.history.replaceState({}, '', '/registro')
    const view = render(<App />)
    expect(screen.getByLabelText('Comuna')).toBeDisabled()
    fill('Región', 'La Araucanía')
    fill('Comuna', 'Temuco')
    fill('Región', 'Valparaíso')
    expect(screen.getByLabelText('Comuna')).toHaveValue('')
    view.unmount()
    registerUser(values)
    localStorage.setItem(
      'nutrivida_sesion',
      JSON.stringify({
        correo: values.correo,
        nombre: values.nombre,
        esAdmin: false,
      }),
    )
    window.history.replaceState({}, '', '/admin/usuarios')
    render(<App />)
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: 'Gestión de Usuarios' }),
    ).not.toBeInTheDocument()
  })
})
