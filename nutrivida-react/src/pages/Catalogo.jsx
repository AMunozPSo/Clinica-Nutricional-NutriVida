import { Container, Row, Col } from 'react-bootstrap'
import TarjetaServicio from '../components/TarjetaServicio'

function Catalogo() {
  // Datos simulados por ahora (las imágenes son de relleno, luego pondrás las tuyas)
  const servicios = [
    { 
      id: 1, 
      titulo: 'Evaluación Nutricional', 
      descripcion: 'Análisis completo de composición corporal y estado actual.', 
      precio: '25.000', 
      imagen: 'https://images.unsplash.com/photo-1550831107-1553da8c8464?w=500&q=80' 
    },
    { 
      id: 2, 
      titulo: 'Nutrición Deportiva', 
      descripcion: 'Plan enfocado en optimizar tu rendimiento físico y ganar masa muscular.', 
      precio: '35.000', 
      imagen: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&q=80' 
    },
    { 
      id: 3, 
      titulo: 'Control de Peso', 
      descripcion: 'Acompañamiento mensual para pérdida de grasa de forma saludable.', 
      precio: '20.000', 
      imagen: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80' 
    }
  ]

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4 text-success">Nuestro Catálogo de Servicios</h2>
      <Row>
        {/* Aquí la magia de React: el método .map() imprime una tarjeta por cada servicio automáticamente */}
        {servicios.map((servicio) => (
          <Col key={servicio.id} md={4} className="mb-4">
            <TarjetaServicio 
              id={servicio.id}
              titulo={servicio.titulo}
              descripcion={servicio.descripcion}
              precio={servicio.precio}
              imagen={servicio.imagen}
            />
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default Catalogo