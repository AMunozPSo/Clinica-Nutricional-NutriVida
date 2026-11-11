import { Link, useParams } from 'react-router-dom'
import { Alert, Button, Card, Container, Table } from 'react-bootstrap'
import { visibleOrders } from '../../lib/commerce'
import { money } from '../../lib/admin'
import { useAdminData } from '../../lib/useAdminData'
export default function OrderResult() {
  const { id } = useParams()
  const orders = useAdminData(visibleOrders)
  const order = orders.find((item) => item.id === id)
  if (!order)
    return (
      <Container className="py-5">
        <h1 className="h2">Comprobante no disponible</h1>
        <p>Inicia sesión con la cuenta que realizó esta compra.</p>
        <Link to="/login">Iniciar sesión</Link>
      </Container>
    )
  const paid = order.estado === 'Pagada'
  return (
    <Container className="py-5">
      <h1 className="h2">
        {paid ? 'Compra exitosa' : 'No se pudo realizar el pago'}
      </h1>
      <Alert variant={paid ? 'success' : 'danger'}>
        {paid
          ? 'Tu compra simulada quedó registrada.'
          : 'El pago de prueba fue rechazado. Conservamos tu carrito para volver a intentarlo.'}
      </Alert>
      <Card className="p-4">
        <h2 className="h4">Comprobante académico</h2>
        <p>
          Folio {order.id}
          <br />
          {new Date(order.fecha).toLocaleString('es-CL')}
          <br />
          {order.nombre} · {order.correo}
          <br />
          {order.direccion}, {order.comuna}, {order.region}
          <br />
          Atención {order.entrega}
        </p>
        <Table responsive>
          <thead>
            <tr>
              <th>Servicio</th>
              <th>Cantidad</th>
              <th>Precio unitario</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id}>
                <td>{item.titulo}</td>
                <td>{item.cantidad}</td>
                <td>{money(item.precio)}</td>
                <td>{money(item.precio * item.cantidad)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <p className="fw-bold">
          Total {money(order.total)} · {order.estado}
        </p>
        <p className="small text-secondary">
          Pago simulado. Este comprobante no es una boleta tributaria y no
          reserva automáticamente una hora.
        </p>
        <div className="d-flex flex-wrap gap-3">
          {paid ? (
            <>
              <Button as={Link} to="/agendar" variant="success">
                Agendar atención
              </Button>
              <Button as={Link} to="/compras" variant="outline-success">
                Mis compras
              </Button>
            </>
          ) : (
            <Button as={Link} to="/checkout" variant="success">
              Reintentar pago
            </Button>
          )}
        </div>
      </Card>
    </Container>
  )
}
