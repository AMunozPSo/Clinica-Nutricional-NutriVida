export const LOCATIONS = {
  'Arica y Parinacota': ['Arica', 'Camarones', 'Putre', 'General Lagos'],
  Tarapacá: ['Iquique', 'Alto Hospicio', 'Pozo Almonte', 'Pica'],
  Antofagasta: ['Antofagasta', 'Calama', 'Tocopilla', 'Mejillones'],
  Atacama: ['Copiapó', 'Caldera', 'Vallenar', 'Chañaral'],
  Coquimbo: ['La Serena', 'Coquimbo', 'Ovalle', 'Illapel'],
  Valparaíso: [
    'Villa Alemana',
    'Quilpué',
    'Viña del Mar',
    'Valparaíso',
    'San Antonio',
    'Quillota',
  ],
  Metropolitana: [
    'Santiago',
    'Providencia',
    'Ñuñoa',
    'Maipú',
    'Puente Alto',
    'La Florida',
  ],
  'O’Higgins': ['Rancagua', 'Machalí', 'San Fernando', 'Santa Cruz'],
  Maule: ['Talca', 'Curicó', 'Linares', 'Cauquenes'],
  Ñuble: ['Chillán', 'Chillán Viejo', 'San Carlos', 'Bulnes'],
  Biobío: ['Concepción', 'Talcahuano', 'Los Ángeles', 'Coronel'],
  'La Araucanía': ['Temuco', 'Padre Las Casas', 'Villarrica', 'Angol'],
  'Los Ríos': ['Valdivia', 'La Unión', 'Panguipulli', 'Río Bueno'],
  'Los Lagos': ['Puerto Montt', 'Osorno', 'Castro', 'Puerto Varas'],
  Aysén: ['Coyhaique', 'Aysén', 'Chile Chico', 'Cochrane'],
  Magallanes: ['Punta Arenas', 'Natales', 'Porvenir', 'Cabo de Hornos'],
}
export const BASE_EMAILS = ['anto.munozp@duocuc.cl', 'feli.arayah@duocuc.cl']
export const normalizeRun = (value = '') =>
  value.replace(/[.\-\s]/g, '').toUpperCase()
export function validRun(value = '') {
  const run = value.trim().toUpperCase()
  if (!/^\d{6,8}[\dK]$/.test(run) || /^0+$/.test(run)) return false
  const body = run.slice(0, -1)
  let sum = 0
  let factor = 2
  for (const digit of [...body].reverse()) {
    sum += Number(digit) * factor
    factor = factor === 7 ? 2 : factor + 1
  }
  const result = 11 - (sum % 11)
  return (
    run.at(-1) === (result === 11 ? '0' : result === 10 ? 'K' : String(result))
  )
}
export function validEmail(value = '', allowBase = false) {
  const email = value.trim().toLowerCase()
  return (
    email.length <= 100 &&
    ((allowBase && BASE_EMAILS.includes(email)) ||
      /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/.test(email))
  )
}
export function validateUser(values, users = [], currentEmail = '') {
  const errors = {}
  const text = (key) => String(values[key] ?? '').trim()
  const correo = text('correo').toLowerCase()
  const run = text('run').toUpperCase()
  if (!text('nombre')) errors.nombre = 'El nombre es obligatorio.'
  else if (text('nombre').length > 50)
    errors.nombre = 'El nombre admite máximo 50 caracteres.'
  if (!text('apellidos')) errors.apellidos = 'Los apellidos son obligatorios.'
  else if (text('apellidos').length > 100)
    errors.apellidos = 'Los apellidos admiten máximo 100 caracteres.'
  if (!validRun(run))
    errors.run =
      'Ingresa un RUN sin puntos ni guion y con dígito verificador válido (ejemplo 123456785).'
  if (!validEmail(correo))
    errors.correo =
      'Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com, de máximo 100 caracteres.'
  if (
    String(values.password ?? '').length < 4 ||
    String(values.password ?? '').length > 10
  )
    errors.password = 'La contraseña debe tener entre 4 y 10 caracteres.'
  if ('confirmPassword' in values && values.password !== values.confirmPassword)
    errors.confirmPassword = 'Las contraseñas no coinciden.'
  if (text('telefono') && !/^\d{9}$/.test(text('telefono')))
    errors.telefono = 'El teléfono debe tener 9 dígitos.'
  if (!text('direccion')) errors.direccion = 'La dirección es obligatoria.'
  else if (text('direccion').length > 300)
    errors.direccion = 'La dirección admite máximo 300 caracteres.'
  if (!LOCATIONS[text('region')]) errors.region = 'Selecciona una región.'
  if (!LOCATIONS[text('region')]?.includes(text('comuna')))
    errors.comuna = 'Selecciona una comuna de la región elegida.'
  if (
    text('fechaNacimiento') &&
    (!/^\d{4}-\d{2}-\d{2}$/.test(text('fechaNacimiento')) ||
      !Number.isFinite(Date.parse(text('fechaNacimiento'))) ||
      new Date(text('fechaNacimiento')).toISOString().slice(0, 10) !==
        text('fechaNacimiento') ||
      text('fechaNacimiento') > new Date().toISOString().slice(0, 10))
  )
    errors.fechaNacimiento =
      'Ingresa una fecha de nacimiento válida que no sea futura.'
  const others = users.filter((user) => user.correo !== currentEmail)
  if (others.some((user) => user.correo?.toLowerCase() === correo))
    errors.correo = 'Ya existe una cuenta registrada con este correo.'
  if (others.some((user) => user.run && normalizeRun(user.run) === run))
    errors.run = 'Ya existe una cuenta registrada con este RUN.'
  return errors
}
export function validateService(value, services = []) {
  const errors = {}
  if (
    !String(value.codigo ?? '').trim() ||
    String(value.codigo).trim().length < 3
  )
    errors.codigo =
      'El código es obligatorio y debe tener al menos 3 caracteres.'
  if (
    services.some(
      (item) =>
        item.id !== value.id &&
        item.codigo?.toLowerCase() === value.codigo?.trim().toLowerCase(),
    )
  )
    errors.codigo = 'El código ya existe.'
  const title = String(value.titulo ?? value.nombre ?? '').trim()
  if (!title || title.length > 100)
    errors.titulo = 'El nombre es obligatorio y admite máximo 100 caracteres.'
  if (String(value.descripcion ?? '').length > 500)
    errors.descripcion = 'La descripción admite máximo 500 caracteres.'
  if (
    value.precio === '' ||
    value.precio == null ||
    !Number.isFinite(Number(value.precio)) ||
    Number(value.precio) < 0
  )
    errors.precio =
      'Ingresa un precio mayor o igual a cero; se permiten decimales.'
  if (
    value.stock === '' ||
    value.stock == null ||
    !Number.isInteger(Number(value.stock)) ||
    Number(value.stock) < 0
  )
    errors.stock =
      'El stock es obligatorio y debe ser un entero mayor o igual a cero.'
  if (
    value.stockCritico !== '' &&
    value.stockCritico != null &&
    (!Number.isInteger(Number(value.stockCritico)) ||
      Number(value.stockCritico) < 0)
  )
    errors.stockCritico =
      'El stock crítico debe ser un entero mayor o igual a cero.'
  if (!value.categoria) errors.categoria = 'Selecciona una categoría.'
  return errors
}
