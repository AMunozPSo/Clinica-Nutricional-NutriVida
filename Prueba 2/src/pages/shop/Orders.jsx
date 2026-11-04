import { Link, Navigate } from 'react-router-dom'
import { Container, Table } from 'react-bootstrap'
import { visibleOrders } from '../../lib/commerce'
import { money } from '../../lib/admin'
import { useSession } from '../../lib/useSession'
import { useAdminData } from '../../lib/useAdminData'
export default function Orders() {
  const session = useSession()
  const allOrders = useAdminData(visibleOrders)
  if (!session) return <Navigate to="/login" replace />
  const orders = allOrders.filter((order) => order.correo === session.correo)
  return (
    <Container className="py-5">
      <h1 className="h2">Mis compras</h1>
      {!orders.length ? (
        <p>No tienes compras registradas.</p>
      ) : (
        <Table responsive>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Comprobante</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{new Date(order.fecha).toLocaleDateString('es-CL')}</td>
                <td>{money(order.total)}</td>
                <td>{order.estado}</td>
                <td>
                  <Link
                    to={`/compra/${order.estado === 'Pagada' ? 'exitosa' : 'fallida'}/${order.id}`}
                  >
                    Ver comprobante
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  )
}
