import { readServices } from './storage'
import { readCategories } from './commerce'

// Carga los ejemplos una sola vez, incluso en navegadores con datos anteriores.
// Después se pueden editar o eliminar desde Administración sin que reaparezcan.
export function initializeDemoCatalog() {
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
