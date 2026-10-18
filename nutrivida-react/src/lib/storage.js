export function readStored(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key))
    return value ?? fallback
  } catch {
    return fallback
  }
}

export function readSession() {
  const session = readStored('nutrivida_sesion', null)
  return session &&
    typeof session.correo === 'string' &&
    typeof session.nombre === 'string'
    ? session
    : null
}

export function loginSession(email, account = null) {
  const users = readStored('nutrivida_usuarios', [])
  const user =
    account ||
    (Array.isArray(users) ? users.find((item) => item.correo === email) : null)
  const esAdmin =
    ['feli.arayah@duocuc.cl', 'anto.munozp@duocuc.cl'].includes(email) ||
    user?.rol === 'admin' ||
    user?.esAdmin === true
  const session = {
    correo: email,
    nombre:
      user?.nombre ||
      (email === 'feli.arayah@duocuc.cl'
        ? 'Felipe'
        : email === 'anto.munozp@duocuc.cl'
          ? 'Antonia'
          : email),
    esAdmin,
    rol: esAdmin
      ? 'admin'
      : email.endsWith('@clinnutrivida.cl')
        ? 'medico'
        : 'paciente',
  }
  localStorage.setItem('nutrivida_sesion', JSON.stringify(session))
  if (esAdmin) localStorage.setItem('adminLogueado', 'true')
  else localStorage.removeItem('adminLogueado')
  window.dispatchEvent(new Event('nutrivida-session'))
  return session
}

export function logoutSession() {
  localStorage.removeItem('nutrivida_sesion')
  localStorage.removeItem('adminLogueado')
  window.dispatchEvent(new Event('nutrivida-session'))
}

const initialServices = [
  {
    id: 1,
    titulo: 'Evaluación Nutricional',
    descripcion:
      'Análisis completo de composición corporal y estado nutricional para definir tus objetivos.',
    precio: '25.000',
    imagen: '/consulta.jpg',
    doctor: 'Camila Rojas',
    categoria: 'evaluaciones',
  },
  {
    id: 2,
    titulo: 'Nutrición Deportiva',
    descripcion:
      'Un plan adaptado a tu entrenamiento para acompañar tu rendimiento y recuperación.',
    precio: '35.000',
    imagen: '/talleres.jpg',
    doctor: 'Ignacio Fuentes',
    categoria: 'planes',
  },
  {
    id: 3,
    titulo: 'Control de Peso',
    descripcion:
      'Acompañamiento para construir hábitos sostenibles y cuidar tu salud.',
    precio: '20.000',
    imagen: '/recepcion.jpg',
    doctor: 'Camila Rojas',
    categoria: 'planes',
    descuento: 10,
  },
]

export function readServices() {
  const services = readStored('serviciosNutriVida', null)
  if (Array.isArray(services)) return services
  const legacy = readStored('nutrivida_servicios', null)
  if (Array.isArray(legacy)) {
    const imported = legacy.map((service) => ({
      ...service,
      titulo: service.nombre || service.titulo,
      precio: Number(service.precio || 0).toLocaleString('es-CL'),
      imagen: service.imagen || '/consulta.jpg',
    }))
    localStorage.setItem('serviciosNutriVida', JSON.stringify(imported))
    return imported
  }
  localStorage.setItem('serviciosNutriVida', JSON.stringify(initialServices))
  return initialServices
}
