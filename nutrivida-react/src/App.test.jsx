import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'
import { loginSession } from './lib/storage'

beforeEach(() => {
  localStorage.clear()
  window.history.replaceState({}, '', '/')
})

describe('Rutas del panel integrado', () => {
  it('muestra el panel sin el menú ni el footer del sitio público', () => {
    loginSession('feli.arayah@duocuc.cl')
    window.history.replaceState({}, '', '/admin')
    render(<App />)
    expect(
      screen.getByRole('navigation', { name: 'Administración' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: 'Contacto' }),
    ).not.toBeInTheDocument()
  })
  it.each([
    ['/home-admin.html', 'Hola Felipe'],
    ['/mantenedor-usuarios.html', 'Gestión de Usuarios'],
    ['/admin-catalogo.html', 'Catálogo de Servicios'],
    ['/mantenedor-servicios.html', 'Catálogo de Servicios'],
    ['/gestor-citas.html', 'Gestor de Citas'],
    ['/admin-reportes.html', 'Reportes y Estadísticas'],
  ])('redirige el enlace anterior %s a su vista React', (path, title) => {
    loginSession('feli.arayah@duocuc.cl')
    window.history.replaceState({}, '', path)
    render(<App />)
    expect(
      screen.getByRole('heading', { name: title, level: 1 }),
    ).toBeInTheDocument()
    expect(window.location.pathname).toMatch(/^\/admin/)
  })
  it('protege también el acceso directo a las rutas internas', () => {
    window.history.replaceState({}, '', '/admin/reportes')
    render(<App />)
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument()
    expect(window.location.pathname).toBe('/login')
  })
})
