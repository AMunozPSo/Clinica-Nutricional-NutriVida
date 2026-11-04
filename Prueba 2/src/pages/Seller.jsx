import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Container, Table, Button, Modal } from 'react-bootstrap'
import { readSession } from '../lib/storage'
import { readUsers, role, serviceList, money } from '../lib/admin'
import { visibleOrders } from '../lib/commerce'
import { useAdminData } from '../lib/useAdminData'
export default function Seller() {
  const session = readSession()
  const users = useAdminData(readUsers)
  const services = useAdminData(serviceList)
  const orders = useAdminData(visibleOrders)
  const [detail, setDetail] = useState(null)
  if (
    !session ||
    !users.some(
      (user) => user.correo === session.correo && role(user) === 'vendedor',
    )
  )
    return <Navigate to="/login" replace />
  return (
    <Container className="py-5">
      <h1>Panel de vendedor</h1>
      <nav aria-label="Vendedor" className="d-flex gap-3 mb-4">
        <a href="#productos">Productos</a>
        <a href="#ordenes">Órdenes</a>
      </nav>
      <h2 id="productos">Servicios disponibles</h2>
      <Table responsive>
        <thead>
          <tr>
            <th>Código</th>
            <th>Servicio</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Detalle</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id}>
              <td>{service.codigo}</td>
              <td>{service.titulo}</td>
              <td>{money(service.precio)}</td>
              <td>{service.stock}</td>
              <td>
                <Link to={`/servicio/${service.id}`}>Ver detalle</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <h2 id="ordenes">Órdenes</h2>
      <Table responsive>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Estado</th>
            <th>Total</th>
            <th>Detalle</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{new Date(order.fecha).toLocaleDateString('es-CL')}</td>
              <td>{order.nombre}</td>
              <td>{order.estado}</td>
              <td>{money(order.total)}</td>
              <td>
                <Button
                  variant="outline-success"
                  onClick={() => setDetail(order)}
                >
                  Ver orden
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {!orders.length && <p>No hay órdenes registradas.</p>}
      <Modal
        show={!!detail}
        onHide={() => setDetail(null)}
        aria-labelledby="seller-order-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="seller-order-title">Detalle de orden</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {detail?.id} · {detail?.estado}
          </p>
          <ul>
            {detail?.items.map((item) => (
              <li key={item.id}>
                {item.cantidad} × {item.titulo}:{' '}
                {money(item.precio * item.cantidad)}
              </li>
            ))}
          </ul>
          <p>Total: {money(detail?.total || 0)}</p>
        </Modal.Body>
      </Modal>
    </Container>
  )
}
