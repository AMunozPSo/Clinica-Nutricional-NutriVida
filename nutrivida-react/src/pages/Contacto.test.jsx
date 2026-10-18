import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Contacto from './Contacto'

describe('Pruebas en el componente <Contacto />', () => {
  it('1. Debe mostrar el título Contáctanos', () => {
    render(<Contacto />)
    expect(screen.getByText(/Contáctanos/i)).toBeInTheDocument()
  })

  it('2. Debe tener un campo para el nombre', () => {
    render(<Contacto />)
    expect(screen.getByLabelText(/Nombre completo/i)).toBeInTheDocument()
  })

  it('3. Debe tener un campo para el correo electrónico', () => {
    render(<Contacto />)
    expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument()
  })

  it('4. Debe contener el botón de enviar', () => {
    render(<Contacto />)
    expect(
      screen.getByRole('button', { name: /Enviar Mensaje/i }),
    ).toBeInTheDocument()
  })
})
