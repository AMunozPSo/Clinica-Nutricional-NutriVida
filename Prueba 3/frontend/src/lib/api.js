const API = import.meta.env.VITE_API_URL || '/api/v1'

export const data = {
  session: null,
  services: [],
  categories: [],
  professionals: [],
  users: [],
  appointments: [],
  orders: [],
  plans: [],
  progress: [],
  patients: [],
  messages: [],
}

let accessToken = ''
let refreshPromise = null
let connectionMessage = ''
const notify = () => window.dispatchEvent(new Event('nutrivida-data'))
const sessionChanged = () => window.dispatchEvent(new Event('nutrivida-session'))
export const connectionNotice = () => connectionMessage
export function notice(message) {
  connectionMessage = message
  notify()
}

function setSession(result) {
  const previous = data.session?.id
  accessToken = result?.accessToken || ''
  data.session = result?.usuario || null
  if (previous !== data.session?.id) {
    for (const key of ['users', 'appointments', 'orders', 'plans', 'progress', 'patients', 'messages']) data[key] = []
  }
  sessionChanged()
  notify()
}

async function fetchJson(path, options = {}) {
  const { body, headers, anonymous, ...rest } = options
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)
  try {
    const response = await fetch(API + path, {
      ...rest,
      signal: controller.signal,
      credentials: 'include',
      headers: {
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(!anonymous && accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...headers,
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    })
    const text = await response.text()
    let result = null
    try { result = text ? JSON.parse(text) : null } catch { /* El proxy puede responder sin JSON. */ }
    if (!response.ok) {
      const error = new Error(result?.message || (response.status === 401 ? 'Inicia sesión nuevamente.' : 'No se pudo completar la solicitud.'))
      error.status = response.status
      error.fields = result?.fields || {}
      throw error
    }
    return result
  } catch (error) {
    if (!error.status) throw new Error('No se pudo conectar con la clínica. Inténtalo nuevamente.')
    throw error
  } finally { clearTimeout(timeout) }
}

export async function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = fetchJson('/auth/refresh', { method: 'POST', anonymous: true, headers: { 'X-NutriVida-Client': 'web' } })
      .then(result => { setSession(result); return result })
      .catch(error => { if (error.status === 401) setSession(null); throw error })
      .finally(() => { refreshPromise = null })
  }
  return refreshPromise
}

export async function request(path, options = {}) {
  try { return await fetchJson(path, options) }
  catch (error) {
    if (error.status !== 401 || options.anonymous || !accessToken || path.startsWith('/auth/')) throw error
    await refreshSession()
    return fetchJson(path, options)
  }
}

const label = value => value ? value[0] + value.slice(1).toLowerCase() : ''
export const appointment = row => ({ ...row, uid: row.id, estado: label(row.estado), modalidad: label(row.modalidad) })
export const order = row => ({ ...row, estado: label(row.estado), entrega: label(row.entrega) })

export async function syncData() {
  const session = data.session
  const all = session?.esAdmin ? '?todos=true' : ''
  const [services, categories, professionals] = await Promise.all([
    request('/servicios' + all), request('/categorias' + all), request('/profesionales'),
  ])
  data.services = services
  data.categories = categories
  data.professionals = professionals
  if (session?.rol === 'vendedor') {
    // El vendedor solo consulta productos y órdenes; no se piden citas, planes ni progreso.
    const orders = await request('/pedidos')
    if (data.session?.id !== session.id) return
    data.orders = orders.map(order)
  } else if (session) {
    const [users, appointments, orders, plans, progress, patients, messages] = await Promise.all([
      session.esAdmin ? request('/usuarios') : Promise.resolve([session]),
      request('/citas'), request('/pedidos'), request('/planes'), request('/progreso'),
      session.esAdmin || session.rol === 'medico' ? request('/pacientes') : Promise.resolve([]),
      session.esAdmin ? request('/contacto') : Promise.resolve([]),
    ])
    if (data.session?.id !== session.id) return
    data.users = users
    data.appointments = appointments.map(appointment)
    data.orders = orders.map(order)
    data.plans = plans
    data.progress = progress
    data.patients = patients
    data.messages = messages
  } else {
    const last = sessionStorage.getItem('nutrivida_ultima_compra')
    const key = last && sessionStorage.getItem(`nutrivida_compra_key_${last}`)
    if (last && key) {
      try { data.orders = [order(await request(`/pedidos/${last}`, { headers: { 'X-Pedido-Key': key }, anonymous: true }))] }
      catch (error) { if (error.status !== 403 && error.status !== 404) throw error }
    }
  }
  notice('')
}

export async function initializeApi() {
  try { await refreshSession() } catch (error) { if (error.status !== 401) throw error }
  await syncData()
}

export async function signIn(correo, password) {
  const result = await request('/auth/login', { method: 'POST', body: { correo, password }, anonymous: true })
  setSession(result)
  await refreshAfterSave()
  return data.session
}

export async function signOut() {
  try {
    await request('/auth/logout', { method: 'POST', anonymous: true, headers: { 'X-NutriVida-Client': 'web' } })
    setSession(null)
    await refreshAfterSave()
    return true
  } catch (error) { notice(error.message); return false }
}

export function updateSession(user) {
  data.session = user
  sessionChanged()
  notify()
}

export async function refreshAfterSave() {
  try { await syncData() }
  catch { notice('La operación se guardó, pero no se pudo actualizar la vista. Recarga la página para comprobar los datos.') }
}

export async function mutate(path, options) {
  const result = await request(path, options)
  await refreshAfterSave()
  return result
}

export function readProfessionals() { return data.professionals }
