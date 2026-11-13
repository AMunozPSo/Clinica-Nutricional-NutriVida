import { useState } from 'react'
import { Navigate, NavLink, Link, Routes, Route, useNavigate } from 'react-router-dom'
import { Button, Modal } from 'react-bootstrap'
import { logoutSession, readServices } from '../lib/storage'
import { readCategories, visibleOrders } from '../lib/commerce'
import { money } from '../lib/admin'
import { useSession } from '../lib/useSession'
import { useAdminData } from '../lib/useAdminData'
import { PageHeading, DataTable, Status } from './admin/shared'
import './admin/admin.css'

// Panel del rol Vendedor: solo lectura de productos (servicios) y órdenes.
// No incluye ningún formulario ni botón que modifique datos.
function Detail({ title, rows, children, onHide }) {
  return (
    <Modal show onHide={onHide} centered size="lg" aria-labelledby="detalle-titulo">
      <Modal.Header closeButton>
        <Modal.Title id="detalle-titulo">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <dl className="row mb-0">
          {rows.map(([label, value]) => (
            <div className="col-sm-6 mb-2" key={label}>
              <dt>{label}</dt>
              <dd className="mb-0">{value || '—'}</dd>
            </div>
          ))}
        </dl>
        {children}
      </Modal.Body>
    </Modal>
  )
}

function Products() {
  const services = useAdminData(readServices)
  const categories = useAdminData(readCategories)
  const [selected, setSelected] = useState(null)
  const category = (id) => categories.find((item) => item.id === id)?.nombre || 'Sin categoría'
  return (
    <>
      <PageHeading
        title="Productos"
        description="Listado de servicios disponibles en el catálogo. Vista de solo lectura."
      />
      <DataTable
        headers={['Servicio', 'Categoría', 'Precio', 'Descuento', 'Detalle']}
        empty={!services.length && 'No hay servicios disponibles.'}
      >
        {services.map((item) => (
          <tr key={item.id}>
            <td>{item.titulo}</td>
            <td>{category(item.categoria)}</td>
            <td>{money(item.precio)}</td>
            <td>{Number(item.descuento || 0)}%</td>
            <td>
              <Button size="sm" variant="outline-light" onClick={() => setSelected(item)}>
                Ver detalle
              </Button>
            </td>
          </tr>
        ))}
      </DataTable>
      {selected && (
        <Detail
          title={selected.titulo}
          onHide={() => setSelected(null)}
          rows={[
            ['Categoría', category(selected.categoria)],
            ['Profesional', selected.doctor],
            ['Precio', money(selected.precio)],
            ['Descuento', `${Number(selected.descuento || 0)}%`],
            ['Modalidad', selected.modalidad],
            ['Duración', `${selected.duracion} minutos`],
          ]}
        >
          <p className="mt-3 mb-0">{selected.descripcion}</p>
        </Detail>
      )}
    </>
  )
}

function Orders() {
  const orders = useAdminData(visibleOrders)
  const [selected, setSelected] = useState(null)
  const date = (value) => new Date(value).toLocaleString('es-CL')
  return (
    <>
      <PageHeading
        title="Órdenes"
        description="Listado de todas las compras registradas. Vista de solo lectura."
      />
      <DataTable
        headers={['Cliente', 'Fecha', 'Total', 'Estado', 'Detalle']}
        empty={!orders.length && 'No hay órdenes registradas.'}
      >
        {orders.map((order) => (
          <tr key={order.id}>
            <td>{order.nombre}</td>
            <td>{date(order.fecha)}</td>
            <td>{money(order.total)}</td>
            <td>
              <Status value={order.estado} />
            </td>
            <td>
              <Button size="sm" variant="outline-light" onClick={() => setSelected(order)}>
                Ver detalle
              </Button>
            </td>
          </tr>
        ))}
      </DataTable>
      {selected && (
        <Detail
          title={`Orden ${selected.id.slice(0, 8)}`}
          onHide={() => setSelected(null)}
          rows={[
            ['Cliente', selected.nombre],
            ['Correo', selected.correo],
            ['Teléfono', selected.telefono],
            ['Dirección', `${selected.direccion}, ${selected.comuna}, ${selected.region}`],
            ['Fecha', date(selected.fecha)],
            ['Modalidad', selected.entrega],
            ['Estado', selected.estado],
            ['Método de pago', selected.metodo],
          ]}
        >
          <table className="table table-sm mt-3 mb-0">
            <thead>
              <tr>
                <th scope="col">Servicio</th>
                <th scope="col">Cantidad</th>
                <th scope="col">Precio unitario</th>
              </tr>
            </thead>
            <tbody>
              {selected.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.titulo}</td>
                  <td>{item.cantidad}</td>
                  <td>{money(item.precio)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th scope="row" colSpan={2}>
                  Total
                </th>
                <td>{money(selected.total)}</td>
              </tr>
            </tfoot>
          </table>
        </Detail>
      )}
    </>
  )
}

export default function Vendedor() {
  const session = useSession()
  const navigate = useNavigate()
  if (!session) return <Navigate to="/login" replace />
  // El administrador ya tiene estas vistas en su panel; cualquier otro rol vuelve al inicio.
  if (session.rol !== 'vendedor') return <Navigate to={session.esAdmin ? '/admin' : '/'} replace />
  return (
    <div className="admin-view">
      <a className="admin-skip" href="#vendedor-content">
        Saltar al contenido
      </a>
      <div className="dashboard-layout">
        <aside className="admin-sidebar">
          <Link className="admin-brand" to="/vendedor">
            NutriVida <span>Ventas</span>
          </Link>
          <p className="admin-sidebar-caption">PANEL DEL VENDEDOR</p>
          <nav aria-label="Vendedor">
            {[
              ['/vendedor', 'Productos', '01'],
              ['/vendedor/ordenes', 'Órdenes', '02'],
            ].map(([url, label, number]) => (
              <NavLink key={url} to={url} end={url === '/vendedor'}>
                <span aria-hidden="true">{number}</span>
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="admin-sidebar-footer">
            <span className="admin-site-link">Hola {session.nombre}</span>
            <button
              className="admin-logout"
              onClick={async () => {
                if (await logoutSession()) navigate('/login', { replace: true })
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        </aside>
        <section className="admin-main" id="vendedor-content" aria-label="Panel del vendedor">
          <Routes>
            <Route index element={<Products />} />
            <Route path="ordenes" element={<Orders />} />
            <Route path="*" element={<Navigate to="/vendedor" replace />} />
          </Routes>
        </section>
      </div>
    </div>
  )
}
