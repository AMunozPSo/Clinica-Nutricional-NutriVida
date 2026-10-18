import { beforeEach, describe, expect, it } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import App from '../App'
import { loginSession, logoutSession } from '../lib/storage'
import { readUsers, saveServices, serviceList, statistics } from '../lib/admin'
import {
  addToCart,
  adoptGuestCart,
  cartDetails,
  deleteCategory,
  placeOrder,
  readCart,
  readCategories,
  salePrice,
  saveCategory,
  setCartQuantity,
  visibleOrders,
} from '../lib/commerce'
import {
  assignPlan,
  deleteProgress,
  doctorAppointments,
  readPlans,
  readProgress,
  saveProgress,
} from '../lib/clinical'

const patient = {
  nombre: 'Persona Prueba',
  correo: 'persona@gmail.com',
  password: 'prueba123',
  rol: 'paciente',
  telefono: '912345678',
  direccion: 'Calle Prueba 123',
  region: 'La Araucanía',
  comuna: 'Temuco',
}
const checkout = { ...patient, entrega: 'Presencial', resultado: 'aprobado' }
function mount(route) {
  window.history.replaceState({}, '', route)
  return render(<App />)
}
function fill(label, value) {
  fireEvent.change(screen.getByLabelText(label, { exact: true }), {
    target: { value },
  })
}
beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  localStorage.setItem('nutrivida_usuarios', JSON.stringify([patient]))
  loginSession(patient.correo)
  window.history.replaceState({}, '', '/')
})

describe('Categorías ofertas y carrito', () => {
  it('muestra las ofertas y aplica el precio descontado al carrito', () => {
    mount('/ofertas')
    expect(screen.getAllByText('Control de Peso').length).toBeGreaterThan(0)
    expect(screen.getByText('$18.000')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Añadir al carrito' }))
    expect(cartDetails()[0].precio).toBe(18000)
    expect(salePrice({ precio: '10.000', descuento: 20 })).toBe(8000)
  })
  it('abre una categoría filtra servicios y muestra un estado sin resultados', () => {
    mount('/categorias')
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Ver servicios de Evaluaciones / Consultas',
      }),
    )
    expect(
      screen.getAllByRole('button', { name: 'Ver Detalles' }),
    ).toHaveLength(1)
    fill('Buscar servicios', 'sin coincidencia')
    expect(
      screen.getByText('No hay servicios disponibles para estos filtros.'),
    ).toBeInTheDocument()
  })
  it('modifica la cantidad y elimina un servicio del carrito', () => {
    addToCart(1)
    mount('/carrito')
    fill('Cantidad de Evaluación Nutricional', '2')
    expect(readCart()[0].cantidad).toBe(2)
    expect(screen.getByText('Total $50.000')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Quitar' }))
    expect(readCart()).toEqual([])
    expect(() => setCartQuantity(1, 11)).toThrow()
  })
  it('traspasa el carrito del invitado al iniciar sesión y omite servicios eliminados', () => {
    logoutSession()
    addToCart(1)
    localStorage.setItem(
      'nutrivida_compra_invitado',
      JSON.stringify([
        { id: 1, cantidad: 2 },
        { id: 999, cantidad: 1 },
      ]),
    )
    loginSession(patient.correo)
    adoptGuestCart()
    expect(readCart()).toEqual([{ id: 1, cantidad: 2 }])
    expect(localStorage.getItem('nutrivida_compra_invitado')).toBeNull()
    mount('/catalogo')
    act(() => logoutSession())
    expect(
      screen.getByRole('link', { name: 'Carrito (0)' }),
    ).toBeInTheDocument()
    act(() => loginSession(patient.correo))
    expect(
      screen.getByRole('link', { name: 'Carrito (2)' }),
    ).toBeInTheDocument()
  })
  it('crea edita y elimina una categoría desde Admin', () => {
    loginSession('feli.arayah@duocuc.cl')
    mount('/admin/categorias')
    fireEvent.click(screen.getByRole('button', { name: 'Nueva categoría' }))
    fill('Nombre de la categoría', 'Nueva categoría de prueba')
    fireEvent.click(screen.getByRole('button', { name: 'Guardar categoría' }))
    expect(
      readCategories().some(
        (item) => item.nombre === 'Nueva categoría de prueba',
      ),
    ).toBe(true)
    const row = screen.getByText('Nueva categoría de prueba').closest('tr')
    fireEvent.click(row.querySelector('button'))
    fill('Nombre de la categoría', 'Categoría actualizada')
    fireEvent.click(screen.getByRole('button', { name: 'Guardar categoría' }))
    const updatedRow = screen.getByText('Categoría actualizada').closest('tr')
    fireEvent.click(updatedRow.querySelectorAll('button')[1])
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }))
    expect(
      readCategories().some((item) => item.nombre === 'Categoría actualizada'),
    ).toBe(false)
  })
  it('valida permisos categorías duplicadas y categorías con servicios asociados', () => {
    expect(() => saveCategory({ nombre: 'Sin permiso' })).toThrow()
    loginSession('feli.arayah@duocuc.cl')
    expect(() => saveCategory({ nombre: '  ' })).toThrow()
    expect(() => saveCategory({ nombre: 'Evaluaciones / Consultas' })).toThrow()
    expect(() => deleteCategory('evaluaciones')).toThrow()
  })
})
describe('Compras simuladas y comprobantes', () => {
  it('autocompleta el checkout y registra una compra aprobada accesible desde Mis compras', () => {
    addToCart(1)
    mount('/checkout')
    expect(screen.getByLabelText('Dirección de contacto')).toHaveValue(
      patient.direccion,
    )
    fireEvent.click(
      screen.getByRole('button', { name: 'Confirmar compra simulada' }),
    )
    expect(
      screen.getByRole('heading', { name: 'Compra exitosa' }),
    ).toBeInTheDocument()
    expect(readCart()).toEqual([])
    fireEvent.click(screen.getByRole('button', { name: 'Mis compras' }))
    expect(screen.getByText('Pagada')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('link', { name: 'Ver comprobante' }))
    expect(
      screen.getByRole('heading', { name: 'Comprobante académico' }),
    ).toBeInTheDocument()
  })
  it('conserva el carrito al rechazar el pago y permite reintentar', () => {
    addToCart(1)
    mount('/checkout')
    fill('Resultado del pago de prueba', 'rechazado')
    fireEvent.click(
      screen.getByRole('button', { name: 'Confirmar compra simulada' }),
    )
    expect(
      screen.getByRole('heading', { name: 'No se pudo realizar el pago' }),
    ).toBeInTheDocument()
    expect(readCart()).toHaveLength(1)
    fireEvent.click(screen.getByRole('button', { name: 'Reintentar pago' }))
    fireEvent.click(
      screen.getByRole('button', { name: 'Confirmar compra simulada' }),
    )
    expect(
      screen.getByRole('heading', { name: 'Compra exitosa' }),
    ).toBeInTheDocument()
    expect(visibleOrders()).toHaveLength(2)
  })
  it('no duplica una orden al confirmar dos veces la misma solicitud', () => {
    addToCart(1)
    const order = placeOrder(checkout, 'same')
    expect(placeOrder(checkout, 'same').id).toBe(order.id)
    expect(visibleOrders()).toHaveLength(1)
  })
  it('rechaza datos vacíos carrito vacío y servicios que ya no están disponibles', () => {
    expect(() =>
      placeOrder({ ...checkout, telefono: '123' }, 'invalid'),
    ).toThrow()
    expect(() => placeOrder(checkout, 'empty')).toThrow()
    addToCart(1)
    loginSession('feli.arayah@duocuc.cl')
    saveServices(serviceList().filter((item) => item.id !== 1))
    loginSession(patient.correo)
    expect(() => placeOrder(checkout, 'deleted')).toThrow()
  })
  it('un invitado solo ve su último comprobante y una cuenta no ve compras de otra', () => {
    logoutSession()
    addToCart(1)
    const order = placeOrder(checkout, 'guest')
    expect(visibleOrders()[0].id).toBe(order.id)
    sessionStorage.clear()
    expect(visibleOrders()).toEqual([])
    loginSession('otra@gmail.com', { nombre: 'Otra persona', rol: 'paciente' })
    expect(visibleOrders()).toEqual([])
  })
  it('muestra las órdenes y su total en el panel de administración', () => {
    addToCart(1)
    placeOrder(checkout, 'admin-order')
    loginSession('feli.arayah@duocuc.cl')
    mount('/admin/ordenes')
    expect(screen.getByText('Persona Prueba')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('link', { name: 'Reportes' }))
    expect(
      screen
        .getByRole('heading', { name: 'Total compras simuladas' })
        .closest('article'),
    ).toHaveTextContent('$25.000')
  })
})
describe('Vistas clínicas y contenidos migrados', () => {
  it('muestra el blog y ambos artículos y maneja un artículo inexistente', () => {
    const view = mount('/blog/1')
    expect(
      screen.getByRole('heading', { name: 'Creatina y nutrición deportiva' }),
    ).toBeInTheDocument()
    view.unmount()
    const second = mount('/blog/2')
    expect(
      screen.getByText(/Las cantidades y combinaciones dependen/),
    ).toBeInTheDocument()
    second.unmount()
    mount('/blog/99')
    expect(
      screen.getByRole('heading', { name: 'Artículo no encontrado' }),
    ).toBeInTheDocument()
  })
  it('registra el progreso y elimina solo los datos de la cuenta activa', () => {
    mount('/historial')
    fill('Fecha del registro', '2026-01-01')
    fill('Peso en kg', '75')
    fireEvent.click(screen.getByRole('button', { name: 'Guardar registro' }))
    expect(readProgress()[0].peso).toBe(75)
    expect(
      screen.getByRole('img', { name: '2026-01-01: 75 kg' }),
    ).toBeInTheDocument()
    expect(() => saveProgress({ fecha: '2026-01-01', peso: 80 })).toThrow()
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar registro' }))
    expect(readProgress()).toEqual([])
  })
  it('valida fechas pesos y acceso a los registros personales', () => {
    expect(() => saveProgress({ fecha: '', peso: 75 })).toThrow()
    expect(() => saveProgress({ fecha: '2026-01-01', peso: 500 })).toThrow()
    saveProgress({ fecha: '2026-01-01', peso: 75 })
    const id = readProgress()[0].id
    loginSession('otra@gmail.com', { nombre: 'Otra persona', rol: 'paciente' })
    deleteProgress(id)
    expect(readProgress()).toEqual([])
    loginSession(patient.correo)
    expect(readProgress()).toHaveLength(1)
  })
  it('muestra la agenda propia del médico y permite asignar un plan a su paciente', () => {
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
          doctorCorreo: doctor.correo,
          doctor: doctor.nombre,
          pacienteCorreo: patient.correo,
          pacienteNombre: patient.nombre,
          servicioNombre: 'Consulta asignada',
          estado: 'Pendiente',
        },
        { id: 2, doctor: 'Otro médico', servicioNombre: 'Cita ajena' },
      ]),
    )
    mount('/doctor')
    expect(screen.getByText('Consulta asignada')).toBeInTheDocument()
    expect(screen.queryByText('Cita ajena')).not.toBeInTheDocument()
    expect(doctorAppointments()).toHaveLength(1)
    fill('Paciente', patient.correo)
    fill('Título del plan', 'Plan personal')
    fill('Indicaciones del profesional', 'Indicaciones académicas de prueba.')
    fireEvent.click(screen.getByRole('button', { name: 'Guardar plan' }))
    act(() => loginSession(patient.correo))
    expect(readPlans()[0].titulo).toBe('Plan personal')
    expect(statistics(readUsers(), [], []).plans).toBe(1)
  })
  it('no asigna un plan a pacientes ajenos y protege la agenda médica', () => {
    expect(() =>
      assignPlan({
        correo: patient.correo,
        titulo: 'Plan',
        contenido: 'Sin permiso',
      }),
    ).toThrow()
    mount('/doctor')
    expect(
      screen.getByRole('heading', { name: 'Bienvenido a Clínica NutriVida' }),
    ).toBeInTheDocument()
  })
  it('el administrador edita un paciente y consulta su historial', () => {
    loginSession('feli.arayah@duocuc.cl')
    mount('/admin/usuarios')
    fireEvent.click(
      screen.getByRole('button', { name: 'Editar a Persona Prueba' }),
    )
    fill('Nombre del usuario', 'Persona Editada')
    fill('Teléfono del usuario', '987654321')
    fill('Dirección del usuario', 'Dirección editada')
    fireEvent.click(screen.getByRole('button', { name: 'Guardar usuario' }))
    expect(
      readUsers().find((item) => item.correo === patient.correo),
    ).toMatchObject({ nombre: 'Persona Editada', telefono: '987654321' })
    fireEvent.click(screen.getByRole('button', { name: 'Ver historial' }))
    expect(
      screen.getByRole('dialog', { name: 'Historial de Persona Editada' }),
    ).toBeInTheDocument()
  })
  it('identifica servicios sin profesional en el listado de revisión', () => {
    loginSession('feli.arayah@duocuc.cl')
    saveServices([{ ...serviceList()[0], doctor: '' }])
    mount('/admin/criticos')
    expect(screen.getByText('Profesional sin asignar')).toBeInTheDocument()
  })
  it('publica Nosotros con profesionales y permite recorrer la clínica', () => {
    const view = mount('/nosotros')
    expect(
      screen.getByRole('heading', { name: 'Sobre NutriVida' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Camila Rojas')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Siguiente imagen' }))
    expect(
      screen.getByAltText('Sala de consulta nutricional'),
    ).toBeInTheDocument()
    view.unmount()
    localStorage.setItem(
      'nutrivida_usuarios',
      JSON.stringify([
        patient,
        {
          nombre: 'Profesional de prueba',
          correo: 'profesional@clinnutrivida.cl',
          rol: 'medico',
        },
      ]),
    )
    mount('/nosotros')
    expect(screen.getByText('Profesional de prueba')).toBeInTheDocument()
  })
  it('solo muestra el plan de la cuenta activa y comunica cuando aún no tiene uno', () => {
    const view = mount('/plan')
    expect(
      screen.getByText(/Todavía no tienes un plan asignado/),
    ).toBeInTheDocument()
    view.unmount()
    loginSession('feli.arayah@duocuc.cl')
    assignPlan({
      correo: patient.correo,
      titulo: 'Plan individual',
      contenido: 'Contenido de prueba asignado por el profesional.',
    })
    loginSession(patient.correo)
    mount('/plan')
    expect(
      screen.getByRole('heading', { name: 'Plan individual' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Contenido de prueba asignado por el profesional.'),
    ).toBeInTheDocument()
  })
  it('rechaza los datos de checkout incompletos y no crea una compra', () => {
    addToCart(1)
    mount('/checkout')
    fill('Teléfono', '12')
    fireEvent.click(
      screen.getByRole('button', { name: 'Confirmar compra simulada' }),
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Completa nombre')
    expect(visibleOrders()).toEqual([])
  })
})
