import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Container, Card, Button } from 'react-bootstrap'

function DetalleServicio() {

  const { id } = useParams()
  const [servicio, setServicio] = useState(null)

  useEffect(() => {

    const datosGuardados = localStorage.getItem('serviciosNutriVida')
    
    if (datosGuardados) {
      const servicios = JSON.parse(datosGuardados)
      const encontrado = servicios.find(s => s.id === parseInt(id))
      setServicio(encontrado)
    }
  }, [id])

  if (!servicio) {
    return (
      <Container className="mt-5 text-center">
        <h3 className="text-muted">Cargando detalles o servicio no encontrado...</h3>
      </Container>
    )
  }


  return (
    <Container className="mt-5 d-flex justify-content-center">
      <Card className="shadow border-0" style={{ maxWidth: '800px', width: '100%' }}>
        <Card.Img variant="top" src={servicio.imagen} alt={servicio.titulo} style={{ height: '350px', objectFit: 'cover' }} />
        <Card.Body className="p-4">
          <Card.Title className="fw-bold fs-2 text-success mb-3">{servicio.titulo}</Card.Title>
          <Card.Text className="fs-5 text-secondary mb-4">{servicio.descripcion}</Card.Text>
          <h3 className="mb-4">Precio: <span className="text-success fw-bold">${servicio.precio}</span></h3>
          
          <div className="d-flex gap-2">
            <Button as={Link} to="/catalogo" variant="outline-secondary" className="px-4">
              Volver al Catálogo
            </Button>
            <Button variant="success" className="px-4">
              Agendar Cita
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default DetalleServicio