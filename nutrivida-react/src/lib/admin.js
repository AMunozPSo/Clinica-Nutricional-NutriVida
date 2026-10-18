import { readServices, readSession, readStored } from './storage'

export const BASE_ADMINS = ['anto.munozp@duocuc.cl', 'feli.arayah@duocuc.cl']
export const CATEGORIES = {
  evaluaciones: 'Evaluaciones / Consultas',
  planes: 'Planes Especializados',
  talleres: 'Talleres Grupales',
  'Control de Peso': 'Control de Peso',
  'Nutrición Deportiva': 'Nutrición Deportiva',
  Vegetariana: 'Nutrición Vegetariana',
  Talleres: 'Educación y Talleres',
}
export const STATES = ['Pendiente', 'Confirmada', 'Completada', 'Cancelada']
export const arrayStored = (key) => {
  const data = readStored(key, [])
  return Array.isArray(data)
    ? data.filter((item) => item && typeof item === 'object')
    : []
}
export const amount = (value) =>
  Number(
    String(value ?? 0)
      .replaceAll('.', '')
      .replace(/[^\d-]/g, ''),
  ) || 0
export const money = (value) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(
    typeof value === 'number' ? value : amount(value),
  )
export function today() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Santiago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}
export function role(user) {
  if (BASE_ADMINS.includes(user.correo)) return 'superadmin'
  if (user.rol === 'admin' || user.esAdmin) return 'admin'
  if (user.rol === 'medico' || user.correo?.endsWith('@clinnutrivida.cl'))
    return 'medico'
  return 'paciente'
}
export function readUsers() {
  const users = new Map()
  for (const user of [
    ...arrayStored('nutrivida_usuarios'),
    ...arrayStored('usuarios'),
  ]) {
    const correo = (user.correo || user.email || '').trim().toLowerCase()
    if (correo && !users.has(correo))
      users.set(correo, {
        ...user,
        correo,
        nombre: user.nombre || user.nombres || '',
      })
  }
  for (const correo of BASE_ADMINS)
    if (!users.has(correo))
      users.set(correo, {
        correo,
        nombre: correo.startsWith('feli') ? 'Felipe' : 'Antonia',
        rol: 'admin',
        password: 'admin123',
      })
  return [...users.values()]
}
export function authorizedSession() {
  const session = readSession()
  if (!session?.esAdmin || localStorage.getItem('adminLogueado') !== 'true')
    return null
  if (BASE_ADMINS.includes(session.correo)) return session
  return readUsers().some(
    (user) => user.correo === session.correo && role(user) === 'admin',
  )
    ? session
    : null
}
function requireAdmin(superOnly = false) {
  const session = authorizedSession()
  if (!session || (superOnly && !BASE_ADMINS.includes(session.correo)))
    throw new Error('No tienes permisos para realizar esta acción.')
  return session
}
function saveUsers(users) {
  localStorage.setItem('nutrivida_usuarios', JSON.stringify(users))
  // Mantiene actualizados los registros del segundo almacén del HTML.
  if (localStorage.getItem('usuarios') !== null)
    localStorage.setItem('usuarios', JSON.stringify(users))
  window.dispatchEvent(new Event('nutrivida-data'))
}
export function createUser(values) {
  requireAdmin()
  const users = readUsers()
  const correo = values.correo.trim().toLowerCase()
  if (
    !values.nombre.trim() ||
    !values.run.trim() ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) ||
    values.password.length < 6
  )
    throw new Error(
      'Completa nombre, RUN, correo válido y una contraseña temporal de al menos 6 caracteres.',
    )
  if (users.some((user) => user.correo === correo))
    throw new Error('Ya existe una cuenta con este correo electrónico.')
  if (
    users.some(
      (user) =>
        user.run &&
        user.run.replaceAll('.', '').toLowerCase() ===
          values.run.trim().replaceAll('.', '').toLowerCase(),
    )
  )
    throw new Error('Ya existe una cuenta con este RUN.')
  saveUsers([
    ...users,
    {
      ...values,
      nombre: values.nombre.trim(),
      run: values.run.trim(),
      correo,
      rol: correo.endsWith('@clinnutrivida.cl') ? 'medico' : 'paciente',
      region: '',
      comuna: '',
      telefono: '',
    },
  ])
}
export function changeUser(correo, action) {
  const session = requireAdmin(action !== 'delete')
  const users = readUsers()
  const target = users.find((user) => user.correo === correo)
  if (!target) throw new Error('No se encontró la cuenta.')
  if (
    BASE_ADMINS.includes(correo) ||
    correo === session.correo ||
    (role(target) === 'admin' && !BASE_ADMINS.includes(session.correo))
  )
    throw new Error('Esta cuenta está protegida.')
  if (action === 'delete')
    saveUsers(users.filter((user) => user.correo !== correo))
  else
    saveUsers(
      users.map((user) =>
        user.correo === correo
          ? {
              ...user,
              esAdmin: action === 'promote',
              rol:
                action === 'promote'
                  ? 'admin'
                  : correo.endsWith('@clinnutrivida.cl')
                    ? 'medico'
                    : 'paciente',
            }
          : user,
      ),
    )
}
export function saveServices(services) {
  requireAdmin()
  localStorage.setItem('serviciosNutriVida', JSON.stringify(services))
  localStorage.setItem(
    'nutrivida_servicios',
    JSON.stringify(
      services.map((service) => ({
        ...service,
        nombre: service.titulo,
        precio: amount(service.precio),
      })),
    ),
  )
  window.dispatchEvent(new Event('nutrivida-data'))
}
export function serviceList() {
  return readServices().map((service) => ({
    ...service,
    titulo: service.titulo || service.nombre || '',
    categoria: service.categoria || 'evaluaciones',
    modalidad: service.modalidad || 'Presencial',
    duracion: service.duracion || 45,
  }))
}
function appointmentIdentity(item) {
  return [
    item.pacienteCorreo || item.correo_usuario || '',
    item.fecha || '',
    item.hora || item.horario || '',
    item.servicioNombre || item.servicio || item.nombre || '',
    item.doctor || '',
  ].join('|')
}
export function readAppointments() {
  const entries = []
  for (const key of ['nutrivida_citas', 'nutrivida_carrito']) {
    arrayStored(key).forEach((raw, index) => {
      // Solo une copias entre almacenes; nunca descarta dos filas del mismo almacén.
      const duplicate = entries.find(
        (item) =>
          !item.refs.some((ref) => ref.key === key) &&
          ((raw.id != null && String(item.id) === String(raw.id)) ||
            appointmentIdentity(item.raw) === appointmentIdentity(raw)),
      )
      if (duplicate) {
        duplicate.refs.push({ key, index })
        return
      }
      entries.push({
        ...raw,
        raw,
        uid: `${key}:${index}`,
        refs: [{ key, index }],
        pacienteNombre: raw.pacienteNombre || raw.nombre_usuario || '',
        pacienteCorreo: raw.pacienteCorreo || raw.correo_usuario || '',
        servicioNombre:
          raw.servicioNombre ||
          raw.servicio ||
          raw.nombre ||
          'Servicio Nutricional',
        hora: raw.hora || raw.horario || '',
        estado: raw.estado || 'Pendiente',
      })
    })
  }
  return entries
}
export function changeAppointment(uid, estado) {
  requireAdmin()
  if (!STATES.includes(estado)) throw new Error('Estado de cita no válido.')
  const appointment = readAppointments().find((item) => item.uid === uid)
  if (!appointment)
    throw new Error('No se encontró la cita. Actualiza la página.')
  for (const ref of appointment.refs) {
    const rows = arrayStored(ref.key)
    rows[ref.index] = { ...rows[ref.index], estado }
    localStorage.setItem(ref.key, JSON.stringify(rows))
  }
  window.dispatchEvent(new Event('nutrivida-data'))
}
export function statistics(users, appointments, services) {
  const patients = users.filter((user) => role(user) === 'paciente').length
  const completed = appointments.filter((item) => item.estado === 'Completada')
  const income = completed.reduce((total, item) => {
    const service =
      services.find(
        (service) => String(service.id) === String(item.servicioId),
      ) || services.find((service) => service.titulo === item.servicioNombre)
    const price = item.precio ?? service?.precio ?? 0
    return total + (typeof price === 'number' ? price : amount(price))
  }, 0)
  return {
    patients,
    income,
    completed: completed.length,
    pending: appointments.filter((item) => item.estado === 'Pendiente').length,
    today: appointments.filter(
      (item) => item.fecha === today() && item.estado !== 'Cancelada',
    ).length,
    plans: arrayStored('nutrivida_planes').length,
  }
}

export function editUser(correo, values) {
  const session = requireAdmin()
  const users = readUsers()
  const current = users.find((user) => user.correo === correo)
  if (!current) throw new Error('Usuario no encontrado.')
  if (
    BASE_ADMINS.includes(correo) ||
    (role(current) === 'admin' && !BASE_ADMINS.includes(session.correo))
  )
    throw new Error('Edita esta cuenta desde su propio perfil.')
  if (
    !values.nombre.trim() ||
    (values.telefono && !/^\d{9}$/.test(values.telefono))
  )
    throw new Error(
      'Ingresa un nombre y un teléfono de 9 dígitos o déjalo vacío.',
    )
  saveUsers(
    users.map((user) =>
      user.correo === correo
        ? {
            ...user,
            nombre: values.nombre.trim(),
            telefono: values.telefono.trim(),
            direccion: values.direccion.trim(),
            run: values.run.trim(),
          }
        : user,
    ),
  )
}
