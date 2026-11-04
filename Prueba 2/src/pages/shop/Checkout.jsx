import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import { readProfile } from '../../lib/account'
import { cartDetails, placeOrder } from '../../lib/commerce'
import { money } from '../../lib/admin'
import { useAdminData } from '../../lib/useAdminData'
export default function Checkout() {
  const rows = useAdminData(cartDetails)
  const [values, setValues] = useState(() => {
    const profile = readProfile()
    return {
      nombre: profile?.nombre || '',
      correo: profile?.correo || '',
      telefono: profile?.telefono || '',
      direccion: profile?.direccion || '',
      region: profile?.region || '',
      comuna: profile?.comuna || '',
      entrega: 'Presencial',
      resultado: 'aprobado',
    }
  })
  const [error, setError] = useState('')
  const [requestId] = useState(() => crypto.randomUUID())
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()
  const submit = (event) => {
    event.preventDefault()
    if (busy) return
    setBusy(true)
    try {
      const order = placeOrder(values, requestId)
      navigate(
        `/compra/${order.estado === 'Pagada' ? 'exitosa' : 'fallida'}/${order.id}`,
        { replace: true },
      )
    } catch (failure) {
      setError(failure.message)
      setBusy(false)
    }
  }
  return (
    <Container className="py-5" style={{ maxWidth: 850 }}>
      <h1 className="h2">Checkout</h1>
      <Alert variant="info" role="note">
        Demostración académica. El pago es simulado y no se cobran fondos ni se
        solicitan datos bancarios.
      </Alert>
      {error && (
        <Alert variant="danger" role="alert">
          {error}
        </Alert>
      )}
      {!rows.length ? (
        <p>
          Tu carrito está vacío. <Link to="/catalogo">Volver al catálogo</Link>
        </p>
      ) : (
        <Card className="p-4">
          <Form noValidate onSubmit={submit}>
            <Row className="g-3">
              {[
                ['nombre', 'Nombre completo', 'text'],
                ['correo', 'Correo electrónico', 'email'],
                ['telefono', 'Teléfono', 'tel'],
                ['direccion', 'Dirección de contacto', 'text'],
                ['region', 'Región', 'text'],
                ['comuna', 'Comuna', 'text'],
              ].map(([key, label, type]) => (
                <Col md={6} key={key}>
                  <Form.Group controlId={`checkout-${key}`}>
                    <Form.Label>{label}</Form.Label>
                    <Form.Control
                      required
                      type={type}
                      value={values[key]}
                      onChange={(event) =>
                        setValues({ ...values, [key]: event.target.value })
                      }
                    />
                  </Form.Group>
                </Col>
              ))}
              <Col md={6}>
                <Form.Group controlId="checkout-mode">
                  <Form.Label>Modalidad de atención</Form.Label>
                  <Form.Select
                    value={values.entrega}
                    onChange={(event) =>
                      setValues({ ...values, entrega: event.target.value })
                    }
                  >
                    <option>Presencial</option>
                    <option>Online</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="checkout-result">
                  <Form.Label>Resultado del pago de prueba</Form.Label>
                  <Form.Select
                    value={values.resultado}
                    onChange={(event) =>
                      setValues({ ...values, resultado: event.target.value })
                    }
                  >
                    <option value="aprobado">Aprobar pago simulado</option>
                    <option value="rechazado">Rechazar pago simulado</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <h2 className="h4 mt-4">Resumen de compra</h2>
            <ul>
              {rows.map((row) => (
                <li key={row.id}>
                  {row.cantidad} × {row.service?.titulo || 'No disponible'} —{' '}
                  {money(row.precio * row.cantidad)}
                </li>
              ))}
            </ul>
            <p className="fw-bold">
              Total{' '}
              {money(
                rows.reduce((sum, row) => sum + row.precio * row.cantidad, 0),
              )}
            </p>
            <Button variant="success" type="submit" disabled={busy}>
              Confirmar compra simulada
            </Button>
          </Form>
        </Card>
      )}
    </Container>
  )
}
