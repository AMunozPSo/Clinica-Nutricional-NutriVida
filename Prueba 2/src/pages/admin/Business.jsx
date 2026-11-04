import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Alert, Button, Form } from 'react-bootstrap'
import {
  readCategories,
  saveCategory,
  deleteCategory,
  visibleOrders,
} from '../../lib/commerce'
import { money, serviceList } from '../../lib/admin'
import { useAdminData } from '../../lib/useAdminData'
import { PageHeading, DataTable, Confirm } from './shared'
export function CategoriesAdmin() {
  const categories = useAdminData(readCategories)
  const [form, setForm] = useState(null)
  const [notice, setNotice] = useState('')
  const [action, setAction] = useState(null)
  return (
    <>
      <PageHeading
        title="Gestión de Categorías"
        description="Crea, edita y elimina categorías del catálogo público."
      >
        <Button variant="success" onClick={() => setForm({ nombre: '' })}>
          Nueva categoría
        </Button>
      </PageHeading>
      {notice && <Alert role="status">{notice}</Alert>}
      {form && (
        <Form
          className="admin-section"
          onSubmit={(event) => {
            event.preventDefault()
            try {
              saveCategory(form)
              setForm(null)
              setNotice('Categoría guardada.')
            } catch (error) {
              setNotice(error.message)
            }
          }}
        >
          <Form.Group controlId="category-name">
            <Form.Label>Nombre de la categoría</Form.Label>
            <Form.Control
              required
              maxLength={100}
              value={form.nombre}
              onChange={(event) =>
                setForm({ ...form, nombre: event.target.value })
              }
            />
          </Form.Group>
          <div className="admin-form-actions">
            <Button variant="outline-light" onClick={() => setForm(null)}>
              Cancelar
            </Button>
            <Button variant="success" type="submit">
              Guardar categoría
            </Button>
          </div>
        </Form>
      )}
      <DataTable
        headers={['Categoría', 'Acciones']}
        empty={!categories.length && 'No hay categorías.'}
      >
        {categories.map((item) => (
          <tr key={item.id}>
            <td>{item.nombre}</td>
            <td>
              <div className="admin-actions">
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={() => setForm(item)}
                >
                  Editar categoría
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() =>
                    setAction({
                      id: item.id,
                      title: 'Eliminar categoría',
                      message: `¿Eliminar ${item.nombre}?`,
                      danger: true,
                    })
                  }
                >
                  Eliminar categoría
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>
      <Confirm
        action={action}
        onHide={() => setAction(null)}
        onConfirm={() => {
          try {
            deleteCategory(action.id)
            setNotice('Categoría eliminada.')
          } catch (error) {
            setNotice(error.message)
          }
          setAction(null)
        }}
      />
    </>
  )
}
export function OrdersAdmin() {
  const orders = useAdminData(visibleOrders)
  return (
    <>
      <PageHeading
        title="Órdenes y comprobantes"
        description="Registro de compras simuladas y sus resultados de pago."
      />
      <DataTable
        headers={['Cliente', 'Fecha', 'Total', 'Estado', 'Comprobante']}
        empty={!orders.length && 'No hay compras registradas.'}
      >
        {[...orders].reverse().map((order) => (
          <tr key={order.id}>
            <td>
              {order.nombre}
              <small>{order.correo}</small>
            </td>
            <td>{new Date(order.fecha).toLocaleString('es-CL')}</td>
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
      </DataTable>
    </>
  )
}
export function CriticalServices() {
  const services = useAdminData(serviceList)
  const critical = services.filter(
    (item) =>
      !item.doctor ||
      !item.imagen ||
      !item.descripcion ||
      !Number(item.duracion) ||
      !Number(String(item.precio).replaceAll('.', '')),
  )
  return (
    <>
      <PageHeading
        title="Servicios que requieren revisión"
        description="Equivalente clínico del listado de productos críticos del template: servicios incompletos o sin profesional asignado."
      />
      <DataTable
        headers={['Servicio', 'Revisión necesaria']}
        empty={!critical.length && 'No hay servicios que requieran revisión.'}
      >
        {critical.map((item) => (
          <tr key={item.id}>
            <td>{item.titulo}</td>
            <td>
              {[
                !item.doctor && 'Profesional sin asignar',
                !item.imagen && 'Sin imagen',
                !item.descripcion && 'Sin descripción',
                !Number(item.duracion) && 'Duración inválida',
                !Number(String(item.precio).replaceAll('.', '')) &&
                  'Precio en cero',
              ]
                .filter(Boolean)
                .join(' · ')}
            </td>
          </tr>
        ))}
      </DataTable>
      <Link className="d-block mt-3" to="/admin/servicios">
        Editar servicios
      </Link>
    </>
  )
}
