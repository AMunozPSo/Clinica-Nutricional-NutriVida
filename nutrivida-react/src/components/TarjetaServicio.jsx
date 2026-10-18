import { Card, Button, Alert, Badge } from 'react-bootstrap'
import { useState } from 'react'
import { addToCart, salePrice } from '../lib/commerce'
import { money } from '../lib/admin'
import { Link } from 'react-router-dom'

function TarjetaServicio({
  id,
  titulo,
  descripcion,
  precio,
  imagen,
  descuento = 0,
}) {
  const [notice, setNotice] = useState('')
  const [error, setError] = useState(false)
  const add = () => {
    try {
      addToCart(id)
      setNotice('Servicio agregado al carrito.')
      setError(false)
    } catch (failure) {
      setNotice(failure.message)
      setError(true)
    }
  }
  return (
    <Card className="h-100 shadow-sm">
      <Card.Img
        variant="top"
        src={imagen}
        alt={titulo}
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="fw-bold">{titulo}</Card.Title>
        <Card.Text>{descripcion}</Card.Text>
        <div className="mt-auto">
          {Number(descuento) > 0 && (
            <>
              <Badge bg="success">{descuento}% de descuento</Badge>
              <del className="d-block text-secondary">{money(precio)}</del>
            </>
          )}
          <h5 className="text-success">
            {money(salePrice({ precio, descuento }))}
          </h5>
        </div>
        {notice && (
          <Alert variant={error ? 'danger' : 'success'} role="status">
            {notice} {!error && <Link to="/carrito">Ver carrito</Link>}
          </Alert>
        )}
        <Button
          as={Link}
          to={`/servicio/${id}`}
          variant="success"
          className="mt-3"
        >
          Ver Detalles
        </Button>
        <Button variant="outline-success" className="mt-2" onClick={add}>
          Añadir al carrito
        </Button>
      </Card.Body>
    </Card>
  )
}

export default TarjetaServicio
