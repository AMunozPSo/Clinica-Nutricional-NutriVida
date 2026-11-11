import { useState } from 'react'
import { addToCart, salePrice } from '../lib/commerce'
import { money } from '../lib/admin'
import { readServices } from '../lib/storage'
import { useParams, Link } from 'react-router-dom'
import { Container, Card, Button, Badge, Alert } from 'react-bootstrap'

function DetalleServicio() {
  const [notice, setNotice] = useState('')
  const { id } = useParams()
  const servicio = readServices().find((item) => String(item.id) === id)

  if (!servicio) {
    return (
      <Container className="mt-5 text-center">
        <h3 className="text-muted">Servicio no encontrado.</h3>
      </Container>
    )
  }

  return (
    <Container className="mt-5 d-flex justify-content-center">
      <Card
        className="shadow border-0"
        style={{ maxWidth: '800px', width: '100%' }}
      >
        <Card.Img
          variant="top"
          src={servicio.imagen}
          alt={servicio.titulo}
          style={{ height: '350px', objectFit: 'cover' }}
        />
        <Card.Body className="p-4">
          <Card.Title className="fw-bold fs-2 text-success mb-3">
            {servicio.titulo}
          </Card.Title>
          <Card.Text className="fs-5 text-secondary mb-4">
            {servicio.descripcion}
          </Card.Text>

          {servicio.doctor && (
            <h5 className="mb-3 text-dark">
              Profesional a cargo:{' '}
              <Badge bg="info" className="text-dark">
                {servicio.doctor}
              </Badge>
            </h5>
          )}

          <h3 className="mb-4">
            Precio:{' '}
            <span className="text-success fw-bold">
              {money(salePrice(servicio))}
            </span>
          </h3>

          {notice && (
            <Alert role="status">
              {notice} <Link to="/carrito">Ver carrito</Link>
            </Alert>
          )}
          <div className="d-flex flex-wrap gap-2">
            <Button
              variant="outline-success"
              onClick={() => {
                try {
                  addToCart(servicio.id)
                  setNotice('Servicio agregado al carrito.')
                } catch (error) {
                  setNotice(error.message)
                }
              }}
            >
              Añadir al carrito
            </Button>
            <Button
              as={Link}
              to="/catalogo"
              variant="outline-secondary"
              className="px-4"
            >
              Volver al Catálogo
            </Button>
            <Button
              as={Link}
              to={`/agendar?servicio=${encodeURIComponent(servicio.id)}`}
              variant="success"
              className="px-4"
            >
              Agendar cita
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default DetalleServicio
