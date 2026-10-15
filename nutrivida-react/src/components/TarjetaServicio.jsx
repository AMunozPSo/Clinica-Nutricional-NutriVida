import { Card, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function TarjetaServicio({ id, titulo, descripcion, precio, imagen }) {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Img variant="top" src={imagen} alt={titulo} style={{ height: '200px', objectFit: 'cover' }} />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="fw-bold">{titulo}</Card.Title>
        <Card.Text>{descripcion}</Card.Text>
        <h5 className="text-success mt-auto">${precio}</h5>
        {/* Este botón nos llevará más adelante al detalle del servicio usando su ID */}
        <Button as={Link} to={`/servicio/${id}`} variant="success" className="mt-3">
          Ver Detalles
        </Button>
      </Card.Body>
    </Card>
  )
}

export default TarjetaServicio