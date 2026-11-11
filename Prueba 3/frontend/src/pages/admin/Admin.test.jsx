import { beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Admin from '../Admin'
import Login from '../Login'
import { loginSession, readServices } from '../../lib/storage'
import {
  authorizedSession,
  changeUser,
  readUsers,
  readAppointments,
  statistics,
  serviceList,
} from '../../lib/admin'

function mount(path = '/admin') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<p>Sitio público</p>} />
      </Routes>
    </MemoryRouter>,
  )
}
function fill(label, value) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } })
}
function seed(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}
const patient = {
  nombre: 'Paciente Prueba',
  correo: 'paciente@gmail.com',
  run: '12345678-9',
  password: 'paciente123',
  rol: 'paciente',
}
const appointment = {
  id: 42,
  pacienteNombre: patient.nombre,
  pacienteCorreo: patient.correo,
  servicioId: 1,
  servicioNombre: 'Evaluación Nutricional',
  fecha: '2026-11-02',
  hora: '10:00',
  estado: 'Pendiente',
}
beforeEach(() => {
  localStorage.clear()
  loginSession('feli.arayah@duocuc.cl')
})

describe('Panel completo de administración', () => {
  it('muestra las cinco secciones y la bandeja de contacto', () => {
    seed('nutrivida_mensajes', [
      {
        id: 1,
        nombre: 'Consulta de prueba',
        correo: 'persona@gmail.com',
        comentario: 'Necesito una evaluación.',
        fecha: '18-10-2026',
      },
    ])
    mount()
    for (const name of [
      'Resumen',
      'Gestión de Usuarios',
      'Catálogo de Servicios',
      'Gestor de Citas',
      'Reportes',
    ])
      expect(screen.getByRole('link', { name })).toBeInTheDocument()
    expect(screen.getByText('Necesito una evaluación.')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Hola Felipe' }),
    ).toBeInTheDocument()
  })
  it('crea un médico, rechaza un correo duplicado y mantiene las cuentas principales protegidas', () => {
    mount('/admin/usuarios')
    fireEvent.click(screen.getByRole('button', { name: '+ Nuevo Paciente' }))
    fill('Nombre completo', 'Médica Prueba')
    fill('RUN', '11111111-1')
    fill('Correo electrónico', 'medica@clinnutrivida.cl')
    fireEvent.click(screen.getByRole('button', { name: 'Guardar Paciente' }))
    const row = screen.getByText('Médica Prueba').closest('tr')
    expect(within(row).getByText('Médico Especialista')).toBeInTheDocument()
    expect(
      readUsers().find((user) => user.correo === 'medica@clinnutrivida.cl').rol,
    ).toBe('medico')
    expect(() => changeUser('feli.arayah@duocuc.cl', 'delete')).toThrow(
      'protegida',
    )
    fireEvent.click(screen.getByRole('button', { name: '+ Nuevo Paciente' }))
    fill('Nombre completo', 'Duplicado')
    fill('RUN', '22222222-2')
    fill('Correo electrónico', 'medica@clinnutrivida.cl')
    fireEvent.click(screen.getByRole('button', { name: 'Guardar Paciente' }))
    expect(screen.getByRole('status')).toHaveTextContent('Ya existe una cuenta')
  })
  it('promueve, permite ingresar y revoca a un administrador regular', () => {
    seed('nutrivida_usuarios', [patient])
    mount('/admin/usuarios')
    fireEvent.click(screen.getByRole('button', { name: 'Hacer Admin' }))
    expect(readUsers().find((user) => user.correo === patient.correo).rol).toBe(
      'paciente',
    )
    fireEvent.click(
      screen.getByRole('button', { name: 'Confirmar cambio de rol' }),
    )
    expect(readUsers().find((user) => user.correo === patient.correo).rol).toBe(
      'admin',
    )
    fireEvent.click(screen.getByRole('button', { name: 'Quitar Admin' }))
    fireEvent.click(
      screen.getByRole('button', { name: 'Confirmar cambio de rol' }),
    )
    expect(readUsers().find((user) => user.correo === patient.correo).rol).toBe(
      'paciente',
    )
  })
  it('elimina una cuenta solo al confirmar y conserva las citas históricas', () => {
    seed('nutrivida_usuarios', [patient])
    seed('nutrivida_citas', [appointment])
    mount('/admin/usuarios')
    fireEvent.click(
      screen.getByRole('button', { name: 'Eliminar a Paciente Prueba' }),
    )
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(readUsers().some((user) => user.correo === patient.correo)).toBe(
      true,
    )
    fireEvent.click(
      screen.getByRole('button', { name: 'Eliminar a Paciente Prueba' }),
    )
    fireEvent.click(
      screen.getByRole('button', { name: 'Confirmar eliminación' }),
    )
    expect(readUsers().some((user) => user.correo === patient.correo)).toBe(
      false,
    )
    expect(readAppointments()).toHaveLength(1)
  })
  it('crea y edita servicios con categoría, modalidad, duración e imagen y sincroniza el HTML', () => {
    mount('/admin/servicios')
    fireEvent.click(screen.getByRole('button', { name: '+ Nuevo Servicio' }))
    fill('Nombre del Servicio', 'Taller de prueba')
    fill('Especialista a Cargo', 'Camila Rojas')
    fill('Precio (CLP)', '18000')
    fill('Duración (minutos)', '60')
    fill('Categoría', 'talleres')
    fill('Modalidad', 'Online')
    fill('Descripción Breve', 'Taller de hábitos alimenticios.')
    fireEvent.click(screen.getByRole('button', { name: 'Guardar Servicio' }))
    const saved = readServices().find(
      (item) => item.titulo === 'Taller de prueba',
    )
    expect(saved).toMatchObject({
      categoria: 'talleres',
      duracion: 60,
      modalidad: 'Online',
      precio: '18.000',
    })
    fireEvent.click(
      screen.getByRole('button', { name: 'Editar Taller de prueba' }),
    )
    fill('Precio (CLP)', '22000')
    fireEvent.click(screen.getByRole('button', { name: 'Actualizar Servicio' }))
    expect(
      JSON.parse(localStorage.getItem('nutrivida_servicios')).find(
        (item) => item.id === saved.id,
      ).precio,
    ).toBe(22000)
  })
  it('filtra citas, confirma el cambio y actualiza los reportes sin duplicar el carrito antiguo', () => {
    seed('nutrivida_usuarios', [patient])
    seed('nutrivida_citas', [appointment])
    seed('nutrivida_carrito', [
      {
        id: 42,
        correo_usuario: patient.correo,
        servicio: appointment.servicioNombre,
        fecha: appointment.fecha,
        horario: '10:00',
        estado: 'Pendiente',
      },
    ])
    mount('/admin/citas')
    expect(readAppointments()).toHaveLength(1)
    fill('Buscar paciente', 'sin resultados')
    expect(
      screen.getByText('No hay citas que coincidan con los filtros.'),
    ).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Limpiar filtros' }))
    fill(/Cambiar estado de cita/, 'Completada')
    expect(readAppointments()[0].estado).toBe('Pendiente')
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar cambio' }))
    expect(
      JSON.parse(localStorage.getItem('nutrivida_carrito'))[0].estado,
    ).toBe('Completada')
    fireEvent.click(screen.getByRole('link', { name: 'Reportes' }))
    expect(
      screen.getByRole('heading', { name: 'Reportes y Estadísticas' }),
    ).toBeInTheDocument()
    const incomeCard = screen
      .getByRole('heading', { name: 'Ingresos Generados' })
      .closest('article')
    expect(incomeCard).toHaveTextContent('$25.000')
    expect(
      statistics(readUsers(), readAppointments(), serviceList()),
    ).toMatchObject({ income: 25000, completed: 1, patients: 1, pending: 0 })
  })
  it('permite cancelar el cierre de sesión y luego confirmarlo', () => {
    mount()
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar Sesión' }))
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(authorizedSession()).not.toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar Sesión' }))
    fireEvent.click(
      screen.getByRole('button', { name: 'Confirmar cierre de sesión' }),
    )
    expect(authorizedSession()).toBeNull()
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument()
  })
  it('permite ingresar con una cuenta promovida y su contraseña temporal', () => {
    seed('nutrivida_usuarios', [{ ...patient, rol: 'admin' }])
    mount('/login')
    fill('Correo electrónico', patient.correo)
    fill('Contraseña', patient.password)
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))
    expect(
      screen.getByRole('heading', { name: 'Hola Paciente Prueba' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Hacer Admin' }),
    ).not.toBeInTheDocument()
  })
  it('impide que un administrador regular promueva usuarios o borre otro administrador', () => {
    seed('nutrivida_usuarios', [
      { ...patient, rol: 'admin' },
      {
        correo: 'admin2@gmail.com',
        nombre: 'Otra cuenta',
        rol: 'admin',
        password: 'clave123',
      },
    ])
    loginSession(patient.correo)
    expect(() => changeUser('admin2@gmail.com', 'delete')).toThrow('protegida')
    expect(() => changeUser('admin2@gmail.com', 'promote')).toThrow('permisos')
    mount('/admin/usuarios')
    expect(
      screen.queryByRole('button', { name: 'Hacer Admin' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /Eliminar a Otra cuenta/ }),
    ).not.toBeInTheDocument()
  })
  it('importa el catálogo antiguo con sus campos adicionales', () => {
    seed('nutrivida_servicios', [
      {
        id: 9,
        nombre: 'Plan antiguo',
        precio: 45000,
        categoria: 'planes',
        doctor: 'Profesional',
        modalidad: 'Online',
        duracion: 30,
      },
    ])
    expect(serviceList()[0]).toMatchObject({
      titulo: 'Plan antiguo',
      precio: '45.000',
      duracion: 30,
      modalidad: 'Online',
      categoria: 'planes',
    })
  })
})
