import { render, screen, fireEvent } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Admin from './pages/Admin'
import Contacto from './pages/Contacto'
import Navigation from './components/Navbar'
import { readServices, readSession } from './lib/storage'

beforeEach(() => localStorage.clear())
function renderSession(path = '/login') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Navigation />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/" element={<p>Inicio público</p>} />
      </Routes>
    </MemoryRouter>,
  )
}
function enter() {
  fireEvent.change(screen.getByLabelText('Correo electrónico'), {
    target: { value: 'FELI.ARAYAH@duocuc.cl' },
  })
  fireEvent.change(screen.getByLabelText('Contraseña'), {
    target: { value: 'admin123' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))
}
describe('Sesión y navegación', () => {
  it('guarda la identidad, saluda y actualiza el menú al entrar y salir', () => {
    renderSession()
    enter()
    expect(
      screen.getByRole('heading', { name: 'Hola Felipe' }),
    ).toBeInTheDocument()
    expect(readSession().correo).toBe('feli.arayah@duocuc.cl')
    expect(
      screen.queryByRole('link', { name: 'Iniciar Sesión' }),
    ).not.toBeInTheDocument()
    fireEvent.click(screen.getAllByRole('button', { name: 'Cerrar Sesión' })[0])
    expect(readSession()).toBeNull()
    expect(
      screen.getByRole('link', { name: 'Iniciar Sesión' }),
    ).toBeInTheDocument()
  })
  it('redirige el acceso sin sesión al login, incluso con una bandera falsa', () => {
    localStorage.setItem('adminLogueado', 'false')
    renderSession('/admin')
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: 'Panel de Administración' }),
    ).not.toBeInTheDocument()
  })
  it('rechaza credenciales incorrectas', () => {
    renderSession()
    fireEvent.change(screen.getByLabelText('Correo electrónico'), {
      target: { value: 'otro@gmail.com' },
    })
    fireEvent.change(screen.getByLabelText('Contraseña'), {
      target: { value: 'incorrecta' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Correo o contraseña incorrectos',
    )
    expect(readSession()).toBeNull()
  })
  it('solo elimina un servicio después de confirmar', () => {
    renderSession()
    enter()
    fireEvent.click(screen.getByRole('link', { name: 'Catálogo de Servicios' }))
    fireEvent.click(screen.getAllByRole('button', { name: /^Eliminar / })[0])
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(readServices()).toHaveLength(3)
    fireEvent.click(screen.getAllByRole('button', { name: /^Eliminar / })[0])
    fireEvent.click(
      screen.getByRole('button', { name: 'Confirmar eliminación' }),
    )
    expect(readServices()).toHaveLength(2)
  })
})
describe('Contacto y persistencia', () => {
  it('valida el formulario y guarda un mensaje sin recargar', () => {
    render(<Contacto />)
    fireEvent.click(screen.getByRole('button', { name: 'Enviar Mensaje' }))
    expect(screen.getByText('El nombre es obligatorio.')).toBeInTheDocument()
    expect(localStorage.getItem('nutrivida_mensajes')).toBeNull()
    fireEvent.change(screen.getByLabelText('Nombre completo'), {
      target: { value: 'Felipe Araya' },
    })
    fireEvent.change(screen.getByLabelText('Correo electrónico'), {
      target: { value: 'felipe@gmail.com' },
    })
    fireEvent.change(screen.getByLabelText('Mensaje o consulta'), {
      target: { value: 'Quiero consultar por una evaluación.' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Enviar Mensaje' }))
    expect(
      JSON.parse(localStorage.getItem('nutrivida_mensajes'))[0].nombre,
    ).toBe('Felipe Araya')
    expect(screen.getByRole('status')).toHaveTextContent(
      'guardado en este navegador',
    )
  })
  it('respeta un catálogo vacío y recupera datos dañados', () => {
    localStorage.setItem('serviciosNutriVida', '[]')
    expect(readServices()).toEqual([])
    localStorage.setItem('serviciosNutriVida', '{invalido')
    expect(readServices()).toHaveLength(3)
  })
})
