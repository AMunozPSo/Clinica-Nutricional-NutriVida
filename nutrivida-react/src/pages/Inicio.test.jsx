import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Inicio from './Inicio'

describe('Pruebas en el componente <Inicio />', () => {
  it('Debe mostrar el título de bienvenida correctamente', () => {
    render(<Inicio />)

    const titulo = screen.getByText(/Bienvenido a Clínica NutriVida/i)

    expect(titulo).toBeInTheDocument()
  })
})
