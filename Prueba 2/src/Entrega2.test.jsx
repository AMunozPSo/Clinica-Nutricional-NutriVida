import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'
import TarjetaServicio from './components/TarjetaServicio'
import { loginSession, readServices } from './lib/storage'
import {
  authorizedSession,
  readUsers,
  serviceList,
  saveServices,
} from './lib/admin'
import { readCart, addToCart, visibleOrders } from './lib/commerce'
import { readMyAppointments } from './lib/account'

const user = {
  nombre: 'Persona',
  apellidos: 'Apellido Prueba',
  run: '123456785',
  correo: 'persona@gmail.com',
  password: 'test123',
  telefono: '912345678',
  direccion: 'Calle 123',
  region: 'La Araucanía',
  comuna: 'Temuco',
  rol: 'paciente',
}
function mount(path) {
  window.history.replaceState({}, '', path)
  return render(<App />)
}
function fill(label, value) {
  fireEvent.change(screen.getByLabelText(label, { exact: true }), {
    target: { value },
  })
}
function submit(name) {
  fireEvent.click(screen.getByRole('button', { name, exact: true }))
}
beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  localStorage.setItem('nutrivida_usuarios', JSON.stringify([user]))
  window.history.replaceState({}, '', '/')
})
afterEach(() => vi.restoreAllMocks())

describe('Diez pruebas de la Evaluación Parcial 2', () => {
  it('T01 renderiza una tarjeta usando props y responde al evento de añadir', () => {
    render(
      <MemoryRouter>
        <TarjetaServicio
          id={1}
          titulo="Atención personalizada"
          descripcion="Descripción recibida mediante props"
          precio={25000}
          imagen="/consulta.jpg"
        />
      </MemoryRouter>,
    )
    expect(screen.getByText('Atención personalizada')).toBeInTheDocument()
    expect(
      screen.getByText('Descripción recibida mediante props'),
    ).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute(
      'alt',
      'Atención personalizada',
    )
    submit('Añadir al carrito')
    expect(screen.getByRole('status')).toHaveTextContent(
      'Servicio agregado al carrito.',
    )
    expect(readCart()).toEqual([{ id: 1, cantidad: 1 }])
  })
  it('T02 muestra el listado de servicios y filtra al cambiar el estado del buscador', () => {
    mount('/catalogo')
    expect(
      screen.getAllByRole('button', { name: 'Ver Detalles' }),
    ).toHaveLength(serviceList().length)
    fill('Buscar servicios', 'Deportiva')
    expect(
      screen.getAllByRole('button', { name: 'Ver Detalles' }),
    ).toHaveLength(1)
    expect(
      screen.getByRole('img', { name: 'Nutrición Deportiva' }),
    ).toBeInTheDocument()
    fill('Buscar servicios', 'sin coincidencias')
    expect(
      screen.getByText('No hay servicios disponibles para estos filtros.'),
    ).toBeInTheDocument()
  })
  it('T03 valida el registro y guarda una cuenta cliente con RUN correcto y datos completos', () => {
    mount('/registro')
    submit('Registrarme')
    expect(
      screen.getByText('Los apellidos son obligatorios.'),
    ).toBeInTheDocument()
    for (const [label, key] of [
      ['Nombre completo', 'nombre'],
      ['Apellidos', 'apellidos'],
      ['Teléfono', 'telefono'],
      ['Correo electrónico', 'correo'],
      ['Contraseña', 'password'],
      ['Repetir contraseña', 'password'],
      ['Dirección (calle y número)', 'direccion'],
      ['Región', 'region'],
      ['Comuna', 'comuna'],
    ])
      fill(label, key === 'correo' ? 'nuevo@gmail.com' : user[key])
    fill('RUN', '11111111-1')
    submit('Registrarme')
    expect(
      screen.getByText(/Ingresa un RUN sin puntos ni guion/),
    ).toBeInTheDocument()
    fill('RUN', '111111111')
    submit('Registrarme')
    expect(screen.getByRole('status')).toHaveTextContent('¡Registro exitoso!')
    expect(
      readUsers().find((row) => row.correo === 'nuevo@gmail.com'),
    ).toMatchObject({
      apellidos: user.apellidos,
      run: '111111111',
      rol: 'paciente',
      esAdmin: false,
    })
  })
  it('T04 rechaza credenciales incorrectas y permite entrar y salir del panel administrativo', () => {
    mount('/login')
    fill('Correo electrónico', 'feli.arayah@duocuc.cl')
    fill('Contraseña', 'error123')
    submit('Entrar')
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Correo o contraseña incorrectos',
    )
    fill('Contraseña', 'admin123')
    submit('Entrar')
    expect(
      screen.getByRole('heading', { name: 'Hola Felipe' }),
    ).toBeInTheDocument()
    expect(authorizedSession()).not.toBeNull()
    submit('Cerrar Sesión')
    submit('Confirmar cierre de sesión')
    expect(authorizedSession()).toBeNull()
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument()
  })
  it('T05 valida contacto y usa un mock para mostrar un fallo de persistencia sin anunciar éxito', () => {
    mount('/contacto')
    submit('Enviar Mensaje')
    expect(screen.getByText('El nombre es obligatorio.')).toBeInTheDocument()
    fill('Nombre completo', 'Consulta')
    fill('Mensaje o consulta', 'Necesito información de la clínica.')
    const original = Storage.prototype.setItem
    const spy = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(function (key, value) {
        if (key === 'nutrivida_mensajes') throw new Error('Sin espacio')
        return original.call(this, key, value)
      })
    submit('Enviar Mensaje')
    expect(screen.getByRole('status')).toHaveTextContent(
      'No se pudo guardar el mensaje.',
    )
    expect(localStorage.getItem('nutrivida_mensajes')).toBeNull()
    spy.mockRestore()
    submit('Enviar Mensaje')
    expect(screen.getByRole('status')).toHaveTextContent(
      'Tu mensaje quedó guardado',
    )
    expect(
      JSON.parse(localStorage.getItem('nutrivida_mensajes'))[0].correo,
    ).toBe('')
  })
  it('T06 crea edita y elimina un servicio con código precio decimal y stock crítico', () => {
    loginSession('feli.arayah@duocuc.cl')
    mount('/admin/servicios')
    submit('+ Nuevo Servicio')
    fill('Código del servicio', 'TEST-001')
    fill('Nombre del Servicio', 'Taller de prueba')
    fill('Especialista a Cargo', 'Camila Rojas')
    fill('Precio (CLP)', '18000.5')
    fill('Stock disponible', '2')
    fill('Stock crítico (opcional)', '3')
    fill('Categoría', 'talleres')
    submit('Guardar Servicio')
    const service = readServices().find((row) => row.codigo === 'TEST-001')
    expect(service).toMatchObject({
      stock: 2,
      stockCritico: 3,
      categoria: 'talleres',
      descripcion: '',
    })
    expect(screen.getByText('Stock crítico')).toBeInTheDocument()
    submit('Editar Taller de prueba')
    fill('Precio (CLP)', '22000.75')
    submit('Actualizar Servicio')
    expect(readServices().find((row) => row.id === service.id).precio).toBe(
      '22.000,75',
    )
    submit('Eliminar Taller de prueba')
    submit('Confirmar eliminación')
    expect(readServices().some((row) => row.id === service.id)).toBe(false)
  })
  it('T07 crea un vendedor y limita su panel a consultas de productos y órdenes', () => {
    loginSession('feli.arayah@duocuc.cl')
    const view = mount('/admin/usuarios')
    submit('+ Nuevo Paciente')
    for (const [label, value] of [
      ['Nombre completo', 'Vendedor'],
      ['Apellidos', 'Prueba'],
      ['RUN', '111111111'],
      ['Correo electrónico', 'vendedor@gmail.com'],
      ['Dirección', 'Calle 123'],
      ['Región', 'La Araucanía'],
      ['Comuna', 'Temuco'],
      ['Tipo de usuario', 'vendedor'],
    ])
      fill(label, value)
    submit('Guardar Paciente')
    expect(
      readUsers().find((row) => row.correo === 'vendedor@gmail.com').rol,
    ).toBe('vendedor')
    view.unmount()
    loginSession('vendedor@gmail.com')
    mount('/vendedor')
    expect(
      screen.getByRole('heading', { name: 'Panel de vendedor' }),
    ).toBeInTheDocument()
    expect(authorizedSession()).toBeNull()
    expect(
      screen.queryByRole('button', { name: '+ Nuevo Servicio' }),
    ).not.toBeInTheDocument()
    expect(() => saveServices([])).toThrow('permisos')
  })
  it('T08 actualiza cantidades del carrito conserva los datos al remontar y permite quitar', () => {
    loginSession(user.correo)
    addToCart(1)
    const view = mount('/carrito')
    fill('Cantidad de Evaluación Nutricional', '2')
    expect(readCart()[0].cantidad).toBe(2)
    expect(
      screen.getByRole('heading', { name: 'Total $50.000' }),
    ).toBeInTheDocument()
    view.unmount()
    mount('/carrito')
    expect(
      screen.getByLabelText('Cantidad de Evaluación Nutricional'),
    ).toHaveValue('2')
    submit('Quitar')
    expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument()
    expect(readCart()).toEqual([])
  })
  it('T09 conserva carrito y stock tras rechazo y los actualiza al aprobar la compra', () => {
    loginSession(user.correo)
    addToCart(1)
    const stock = serviceList()[0].stock
    mount('/checkout')
    expect(screen.getByLabelText('Dirección de contacto')).toHaveValue(
      user.direccion,
    )
    fill('Resultado del pago de prueba', 'rechazado')
    submit('Confirmar compra simulada')
    expect(
      screen.getByRole('heading', { name: 'No se pudo realizar el pago' }),
    ).toBeInTheDocument()
    expect(readCart()).toHaveLength(1)
    expect(serviceList()[0].stock).toBe(stock)
    submit('Reintentar pago')
    submit('Confirmar compra simulada')
    expect(
      screen.getByRole('heading', { name: 'Compra exitosa' }),
    ).toBeInTheDocument()
    expect(readCart()).toEqual([])
    expect(serviceList()[0].stock).toBe(stock - 1)
    expect(visibleOrders()).toHaveLength(2)
  })
  it('T10 agenda una cita y la cancela con confirmación desde el listado personal', () => {
    loginSession(user.correo)
    mount('/agendar?servicio=1')
    const date = new Date()
    date.setUTCDate(date.getUTCDate() + 7)
    while ([0, 6].includes(date.getUTCDay()))
      date.setUTCDate(date.getUTCDate() + 1)
    fill('Fecha', date.toISOString().slice(0, 10))
    fill('Hora', '10:00')
    fill('Motivo de consulta (opcional)', 'Primera evaluación')
    submit('Confirmar cita')
    expect(screen.getByRole('status')).toHaveTextContent(
      '¡Cita agendada con éxito!',
    )
    expect(readMyAppointments()).toHaveLength(1)
    submit('Ver mis citas')
    submit('Cancelar cita')
    const modal = screen.getByRole('dialog')
    fireEvent.click(
      within(modal).getByRole('button', { name: 'Confirmar cancelación' }),
    )
    expect(readMyAppointments()[0].estado).toBe('Cancelada')
  })
})
