import { readServices } from './storage'
import { readCategories } from './commerce'
import { CATEGORIES } from './admin'

// Carga los ejemplos una sola vez, incluso en navegadores con datos anteriores.
// Después se pueden editar o eliminar desde Administración sin que reaparezcan.
export function initializeDemoCatalog() {
  initializeWelcomeExample()
  initializeMoreExamples()
}

function initializeWelcomeExample() {
  const marker = 'nutrivida_ejemplos_catalogo_v1'
  if (localStorage.getItem(marker)) return

  const categories = readCategories()
  const name = 'Bienestar y hábitos saludables'
  const category = categories.find(
    (item) => item.nombre.toLowerCase() === name.toLowerCase(),
  ) || { id: 'bienestar-habitos', nombre: name }
  if (!categories.some((item) => item.id === category.id))
    categories.push(category)

  const services = [...readServices()]
  if (!services.some((item) => item.id === 'consulta-habitos-ejemplo'))
    services.push({
      id: 'consulta-habitos-ejemplo',
      titulo: 'Consulta de hábitos saludables',
      descripcion:
        'Consulta de 45 minutos para revisar tus hábitos de alimentación y organizar una rutina equilibrada. Promoción de bienvenida de ejemplo: 20% de descuento.',
      precio: '30.000',
      descuento: 20,
      imagen: '/consulta.jpg',
      doctor: 'Camila Rojas',
      categoria: category.id,
      duracion: 45,
      modalidad: 'Presencial',
    })

  localStorage.setItem('nutrivida_categorias', JSON.stringify(categories))
  localStorage.setItem('serviciosNutriVida', JSON.stringify(services))
  localStorage.setItem(marker, 'true')
}

function initializeMoreExamples() {
  const marker = 'nutrivida_ejemplos_catalogo_v2'
  if (localStorage.getItem(marker)) return

  const categories = readCategories()
  for (const [id, nombre] of Object.entries(CATEGORIES)) {
    if (!categories.some((item) => item.id === id))
      categories.push({ id, nombre })
  }
  const wellness = categories.find(
    (item) => item.nombre.toLowerCase() === 'bienestar y hábitos saludables',
  ) || { id: 'bienestar-habitos', nombre: 'Bienestar y hábitos saludables' }
  if (!categories.some((item) => item.id === wellness.id))
    categories.push(wellness)

  const examples = [
    {
      id: 'ejemplo-evaluacion-integral',
      titulo: 'Evaluación nutricional integral',
      descripcion:
        'Revisión de hábitos, composición corporal y objetivos personales en una consulta inicial de 60 minutos.',
      categoria: 'evaluaciones',
      precio: '28.000',
      descuento: 15,
      duracion: 60,
    },
    {
      id: 'ejemplo-plan-personalizado',
      titulo: 'Plan de alimentación personalizado',
      descripcion:
        'Consulta para organizar una pauta de alimentación según tus horarios, preferencias y objetivos de bienestar.',
      categoria: 'planes',
      precio: '40.000',
      descuento: 20,
      duracion: 60,
    },
    {
      id: 'ejemplo-taller-cocina',
      titulo: 'Taller de cocina saludable',
      descripcion:
        'Aprende preparaciones sencillas, combinaciones equilibradas y consejos para cocinar durante la semana.',
      categoria: 'talleres',
      precio: '18.000',
      descuento: 10,
      duracion: 90,
      imagen: '/talleres.jpg',
    },
    {
      id: 'ejemplo-seguimiento-peso',
      titulo: 'Seguimiento de hábitos y control de peso',
      descripcion:
        'Revisa tus avances y ajusta tus hábitos con acompañamiento nutricional centrado en metas sostenibles.',
      categoria: 'Control de Peso',
      precio: '26.000',
      descuento: 15,
      duracion: 30,
    },
    {
      id: 'ejemplo-evaluacion-deportiva',
      titulo: 'Evaluación de nutrición deportiva',
      descripcion:
        'Consulta para revisar alimentación, hidratación y recuperación de acuerdo con tu actividad física.',
      categoria: 'Nutrición Deportiva',
      precio: '45.000',
      descuento: 20,
      duracion: 60,
      doctor: 'Ignacio Fuentes',
    },
    {
      id: 'ejemplo-consulta-vegetariana',
      titulo: 'Consulta de alimentación vegetariana',
      descripcion:
        'Orientación para organizar comidas variadas y conocer fuentes vegetales de proteínas y otros nutrientes.',
      categoria: 'Vegetariana',
      precio: '32.000',
      descuento: 15,
      duracion: 45,
    },
    {
      id: 'ejemplo-taller-etiquetas',
      titulo: 'Taller de lectura de etiquetas',
      descripcion:
        'Aprende a interpretar porciones, ingredientes y sellos de advertencia con ejemplos de productos cotidianos.',
      categoria: 'Talleres',
      precio: '15.000',
      descuento: 20,
      duracion: 60,
      imagen: '/talleres.jpg',
      modalidad: 'Online',
    },
    {
      id: 'ejemplo-organizacion-semanal',
      titulo: 'Organización del menú semanal',
      descripcion:
        'Sesión práctica para planificar tus comidas, preparar una lista de compras y aprovechar mejor tus alimentos.',
      categoria: wellness.id,
      precio: '22.000',
      descuento: 10,
      duracion: 60,
      modalidad: 'Online',
    },
  ]
  const services = [...readServices()]
  for (const example of examples) {
    if (!services.some((item) => item.id === example.id))
      services.push({
        imagen: '/consulta.jpg',
        doctor: 'Camila Rojas',
        modalidad: 'Presencial',
        ...example,
      })
  }

  localStorage.setItem('nutrivida_categorias', JSON.stringify(categories))
  localStorage.setItem('serviciosNutriVida', JSON.stringify(services))
  localStorage.setItem(marker, 'true')
}
