import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from './compat'
import Catalogo from '../../src/pages/Catalogo'
import Checkout from '../../src/pages/shop/Checkout'
import OrderResult from '../../src/pages/shop/OrderResult'
import Blog from '../../src/pages/content/Blog'
import Doctor from '../../src/pages/content/Doctor'
import Progress from '../../src/pages/content/Progress'
import Plan from '../../src/pages/content/Plan'
import TarjetaServicio from '../../src/components/TarjetaServicio'
import { loginSession } from '../../src/lib/storage'
import { readMyAppointments } from '../../src/lib/account'
import {
  addToCart,
  cartDetails,
  placeOrder,
  readCart,
  saveCategory,
  deleteCategory,
  visibleOrders,
} from '../../src/lib/commerce'
import {
  readProgress,
  saveProgress,
  deleteProgress,
  assignPlan,
  readPlans,
  doctorAppointments,
} from '../../src/lib/clinical'
import { readCategories } from '../../src/lib/commerce'
import { readUsers, editUser } from '../../src/lib/admin'
import '../../src/pages/Shop.test.jsx'
import '../../src/App.test.jsx'
import '../../src/Session.test.jsx'
import '../../src/pages/Account.test.jsx'
import '../../src/pages/AgendarCita.test.jsx'
import '../../src/pages/Contacto.test.jsx'
import '../../src/pages/Inicio.test.jsx'
import '../../src/pages/Login.test.jsx'
import '../../src/pages/Registro.test.jsx'
import '../../src/pages/admin/Admin.test.jsx'

globalThis.IS_REACT_ACT_ENVIRONMENT = true
const patient = {
  nombre: 'Persona Jasmine',
  correo: 'jasmine@gmail.com',
  password: 'prueba123',
  rol: 'paciente',
  telefono: '912345678',
  direccion: 'Calle 123',
  region: 'La Araucanía',
  comuna: 'Temuco',
}
const checkout = { ...patient, entrega: 'Presencial', resultado: 'aprobado' }
function login() {
  localStorage.setItem('nutrivida_usuarios', JSON.stringify([patient]))
  loginSession(patient.correo)
}
function fill(label, value) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } })
}
function mount(route) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/compra/:resultado/:id" element={<OrderResult />} />
        <Route path="/blog/:id" element={<Blog />} />
        <Route path="/doctor" element={<Doctor />} />
        <Route path="/historial" element={<Progress />} />
        <Route path="/plan" element={<Plan />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('Casos nativos Jasmine de la entrega 2', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    window.history.replaceState({}, '', '/')
    login()
  })
  afterEach(cleanup)
  it('J01 renderiza la tarjeta usando sus props', () => {
    render(
      <MemoryRouter>
        <TarjetaServicio
          id={77}
          titulo="Atención personalizada"
          descripcion="Descripción por props"
          precio="10.000"
          imagen="/consulta.jpg"
        />
      </MemoryRouter>,
    )
    expect(screen.getByText('Atención personalizada')).toBeInTheDocument()
    expect(screen.getByText('Descripción por props')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Ver Detalles' }).getAttribute('href'),
    ).toBe('/servicio/77')
  })
  it('J02 el clic añade el servicio al carrito y muestra la confirmación condicional', () => {
    mount('/catalogo')
    expect(screen.queryByText('Servicio agregado al carrito.')).toBeNull()
    fireEvent.click(
      screen.getAllByRole('button', { name: 'Añadir al carrito' })[0],
    )
    expect(readCart()[0].cantidad).toBe(1)
    expect(
      screen.getByText('Servicio agregado al carrito.'),
    ).toBeInTheDocument()
  })
  it('J03 el buscador modifica el estado y filtra el DOM', () => {
    mount('/catalogo')
    fill('Buscar servicios', 'Deportiva')
    expect(screen.getAllByRole('button', { name: 'Ver Detalles' }).length).toBe(
      1,
    )
    expect(screen.getAllByText('Nutrición Deportiva').length).toBeGreaterThan(0)
  })
  it('J04 una compra aprobada guarda la orden y vacía el carrito', () => {
    addToCart(1)
    const order = placeOrder(checkout, 'jasmine-approved')
    expect(order.estado).toBe('Pagada')
    expect(order.total).toBe(25000)
    expect(readCart()).toEqual([])
    expect(visibleOrders()[0].id).toBe(order.id)
  })
  it('J05 una compra rechazada conserva el carrito', () => {
    addToCart(1)
    expect(
      placeOrder({ ...checkout, resultado: 'rechazado' }, 'jasmine-rejected')
        .estado,
    ).toBe('Rechazada')
    expect(readCart()[0].cantidad).toBe(1)
  })
  it('J06 el identificador de la compra evita duplicarla', () => {
    addToCart(1)
    const order = placeOrder(checkout, 'same-request')
    expect(placeOrder(checkout, 'same-request').id).toBe(order.id)
    expect(visibleOrders().length).toBe(1)
  })
  it('J07 utiliza un spy de Jasmine para simular un fallo de persistencia', () => {
    mount('/historial')
    fill('Fecha del registro', '2026-01-01')
    fill('Peso en kg', '75')
    const original = Storage.prototype.setItem
    const spy = globalThis
      .spyOn(Storage.prototype, 'setItem')
      .and.callFake(function (key, value) {
        if (key === 'nutrivida_progreso')
          throw new Error('Almacenamiento de prueba lleno')
        return original.call(this, key, value)
      })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar registro' }))
    expect(spy).toHaveBeenCalled()
    expect(readProgress().length).toBe(0)
    expect(screen.getByRole('status').textContent).toContain(
      'Almacenamiento de prueba lleno',
    )
  })
  it('J08 registra y elimina el progreso de la cuenta actual', () => {
    saveProgress({ fecha: '2026-01-01', peso: 75 })
    const row = readProgress()[0]
    expect(row.peso).toBe(75)
    deleteProgress(row.id)
    expect(readProgress()).toEqual([])
  })
  it('J09 rechaza pesos y fechas inválidos', () => {
    expect(() => saveProgress({ fecha: '2099-01-01', peso: 75 })).toThrow(
      'fecha válida',
    )
    expect(() => saveProgress({ fecha: '2026-01-01', peso: 5 })).toThrow(
      'peso entre',
    )
  })
  it('J10 el administrador crea edita y elimina una categoría', () => {
    loginSession('feli.arayah@duocuc.cl')
    saveCategory({ nombre: 'Categoría de prueba' })
    const category = readCategories().find(
      (item) => item.nombre === 'Categoría de prueba',
    )
    saveCategory({ ...category, nombre: 'Categoría editada' })
    expect(
      readCategories().find((item) => item.id === category.id).nombre,
    ).toBe('Categoría editada')
    deleteCategory(category.id)
    expect(readCategories().some((item) => item.id === category.id)).toBe(false)
  })
  it('J11 no elimina una categoría con servicios asociados', () => {
    loginSession('feli.arayah@duocuc.cl')
    expect(() => deleteCategory('evaluaciones')).toThrow('servicios asociados')
  })
  it('J12 un paciente no puede administrar categorías', () => {
    expect(() => saveCategory({ nombre: 'Sin permiso' })).toThrow(
      'administradores',
    )
  })
  it('J13 el administrador edita datos de un paciente sin cambiar sus credenciales', () => {
    loginSession('feli.arayah@duocuc.cl')
    editUser(patient.correo, {
      nombre: 'Nombre nuevo',
      telefono: '987654321',
      direccion: 'Dirección nueva',
      run: '12345678-9',
    })
    expect(
      readUsers().find((user) => user.correo === patient.correo).password,
    ).toBe('prueba123')
  })
  it('J14 cada médico ve solo sus citas asignadas', () => {
    const doctor = {
      nombre: 'Camila Rojas',
      correo: 'camila@clinnutrivida.cl',
      rol: 'medico',
    }
    localStorage.setItem(
      'nutrivida_usuarios',
      JSON.stringify([patient, doctor]),
    )
    loginSession(doctor.correo)
    localStorage.setItem(
      'nutrivida_citas',
      JSON.stringify([
        {
          id: 1,
          doctor: 'Camila Rojas',
          pacienteCorreo: patient.correo,
          servicioNombre: 'Consulta propia',
        },
        { id: 2, doctor: 'Otro Profesional', servicioNombre: 'Consulta ajena' },
      ]),
    )
    expect(doctorAppointments().length).toBe(1)
    mount('/doctor')
    expect(screen.getByText('Consulta propia')).toBeInTheDocument()
    expect(screen.queryByText('Consulta ajena')).toBeNull()
  })
  it('J15 el plan asignado por el administrador se muestra al paciente correcto', () => {
    loginSession('feli.arayah@duocuc.cl')
    assignPlan({
      correo: patient.correo,
      titulo: 'Plan de seguimiento',
      contenido: 'Indicaciones de demostración.',
    })
    loginSession(patient.correo)
    expect(readPlans()[0].titulo).toBe('Plan de seguimiento')
    mount('/plan')
    expect(
      screen.getByText('Indicaciones de demostración.'),
    ).toBeInTheDocument()
  })
  it('J16 el checkout autocompleta los datos del perfil y muestra el resultado', async () => {
    addToCart(1)
    mount('/checkout')
    expect(screen.getByLabelText('Dirección de contacto').value).toBe(
      'Calle 123',
    )
    fireEvent.click(
      screen.getByRole('button', { name: 'Confirmar compra simulada' }),
    )
    expect(
      await screen.findByRole('heading', { name: 'Compra exitosa' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Comprobante académico')).toBeInTheDocument()
  })
  it('J17 permite elegir el resultado fallido y reintentar el pago', async () => {
    addToCart(1)
    mount('/checkout')
    fill('Resultado del pago de prueba', 'rechazado')
    fireEvent.click(
      screen.getByRole('button', { name: 'Confirmar compra simulada' }),
    )
    expect(
      await screen.findByRole('heading', {
        name: 'No se pudo realizar el pago',
      }),
    ).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Reintentar pago' }))
    expect(
      await screen.findByRole('heading', { name: 'Checkout' }),
    ).toBeInTheDocument()
  })
  it('J18 no se exponen órdenes de otra cuenta', () => {
    addToCart(1)
    placeOrder(checkout, 'private-order')
    loginSession('anto.munozp@duocuc.cl')
    expect(visibleOrders().length).toBe(1)
    loginSession('otro@gmail.com', {
      nombre: 'Otra persona',
      correo: 'otro@gmail.com',
      rol: 'paciente',
    })
    expect(visibleOrders()).toEqual([])
  })
  it('J19 el blog abre el artículo elegido', async () => {
    mount('/blog/1')
    expect(
      await screen.findByRole('heading', {
        name: 'Creatina y nutrición deportiva',
      }),
    ).toBeInTheDocument()
  })
  it('J20 comprar no inventa una cita sin fecha ni hora', () => {
    addToCart(1)
    placeOrder(checkout, 'no-appointment')
    expect(readMyAppointments()).toEqual([])
    expect(cartDetails()).toEqual([])
  })
})
