import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Alert, Button, Container, Form, Table } from 'react-bootstrap'
import { cartDetails, setCartQuantity } from '../../lib/commerce'
import { money } from '../../lib/admin'
import { useAdminData } from '../../lib/useAdminData'
export default function Cart() {
  const rows = useAdminData(cartDetails)
  const [error, setError] = useState('')
  const update = (id, quantity) => {
    try {
      setCartQuantity(id, quantity)
      setError('')
    } catch (failure) {
      setError(failure.message)
    }
  }
  return (
    <Container className="py-5">
      <h1 className="h2">Carrito de servicios</h1>
      <p>
        Compra atenciones y planes. La fecha de atención se reserva por separado
        en Agendar cita.
      </p>
      {error && <Alert variant="danger">{error}</Alert>}
      {!rows.length ? (
        <Alert variant="info">
          Tu carrito está vacío. <Link to="/catalogo">Explorar servicios</Link>
        </Alert>
      ) : (
        <>
          <Table responsive className="bg-white align-middle">
            <thead>
              <tr>
                <th>Servicio</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.service?.titulo || 'Servicio no disponible'}</td>
                  <td>{money(row.precio)}</td>
                  <td>
                    <Form.Select
                      aria-label={`Cantidad de ${row.service?.titulo || row.id}`}
                      value={row.cantidad}
                      onChange={(event) =>
                        update(row.id, Number(event.target.value))
                      }
                    >
                      {Array.from({ length: 10 }, (_, i) => (
                        <option key={i + 1}>{i + 1}</option>
                      ))}
                    </Form.Select>
                  </td>
                  <td>{money(row.precio * row.cantidad)}</td>
                  <td>
                    <Button
                      variant="outline-danger"
                      onClick={() => update(row.id, 0)}
                    >
                      Quitar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <h2 className="h4">
            Total{' '}
            {money(
              rows.reduce((sum, row) => sum + row.precio * row.cantidad, 0),
            )}
          </h2>
          <Button as={Link} to="/checkout" variant="success">
            Continuar al checkout
          </Button>
        </>
      )}
    </Container>
  )
}
