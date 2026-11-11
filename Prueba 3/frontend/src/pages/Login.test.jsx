import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Login from './Login'
import { MemoryRouter } from 'react-router-dom'

describe('Pruebas en el componente <Login />', () => {
  it('5. Debe mostrar el título Iniciar Sesión', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    )
    expect(screen.getByText(/Iniciar Sesión/i)).toBeInTheDocument()
  })

  it('6. Debe tener un campo para el correo', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    )
    expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument()
  })

  it('7. Debe tener un campo para la contraseña', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    )
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument()
  })

  it('8. El campo de contraseña debe ser de tipo oculto (password)', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    )
    const inputPassword = screen.getByLabelText(/Contraseña/i)
    expect(inputPassword).toHaveAttribute('type', 'password')
  })

  it('9. Debe contener el botón de Entrar', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    )
    expect(screen.getByRole('button', { name: /Entrar/i })).toBeInTheDocument()
  })
})
