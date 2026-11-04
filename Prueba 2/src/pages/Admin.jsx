import { useEffect, useState } from 'react'
import {
  Navigate,
  NavLink,
  Link,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom'
import { Button, Modal } from 'react-bootstrap'
import { logoutSession } from '../lib/storage'
import { authorizedSession } from '../lib/admin'
import Overview from './admin/Overview'
import Users from './admin/Users'
import Services from './admin/Services'
import Appointments from './admin/Appointments'
import Reports from './admin/Reports'
import {
  CategoriesAdmin,
  OrdersAdmin,
  CriticalServices,
} from './admin/Business'
import './admin/admin.css'

export default function Admin() {
  const [session, setSession] = useState(authorizedSession)
  const [confirmLogout, setConfirmLogout] = useState(false)
  const navigate = useNavigate()
  useEffect(() => {
    const update = () => setSession(authorizedSession())
    for (const name of ['storage', 'nutrivida-session', 'nutrivida-data'])
      window.addEventListener(name, update)
    return () => {
      for (const name of ['storage', 'nutrivida-session', 'nutrivida-data'])
        window.removeEventListener(name, update)
    }
  }, [])
  if (!session) return <Navigate to="/login" replace />
  return (
    <div className="admin-view">
      <a className="admin-skip" href="#admin-content">
        Saltar al contenido
      </a>
      <div className="dashboard-layout">
        <aside className="admin-sidebar">
          <Link className="admin-brand" to="/admin">
            NutriVida <span>Admin</span>
          </Link>
          <p className="admin-sidebar-caption">ADMINISTRACIÓN DE LA CLÍNICA</p>
          <nav aria-label="Administración">
            {[
              ['/admin', 'Resumen', '01'],
              ['/admin/usuarios', 'Gestión de Usuarios', '02'],
              ['/admin/servicios', 'Catálogo de Servicios', '03'],
              ['/admin/citas', 'Gestor de Citas', '04'],
              ['/admin/reportes', 'Reportes', '05'],
              ['/admin/categorias', 'Categorías', '06'],
              ['/admin/ordenes', 'Órdenes y comprobantes', '07'],
              ['/admin/criticos', 'Servicios por revisar', '08'],
            ].map(([url, label, number]) => (
              <NavLink key={url} to={url} end={url === '/admin'}>
                <span aria-hidden="true">{number}</span>
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="admin-sidebar-footer">
            <Link className="admin-site-link" to="/perfil">
              Hola {session.nombre} · Mi perfil
            </Link>
            <Link className="admin-site-link" to="/citas">
              Mis citas
            </Link>
            <Link className="admin-site-link" to="/">
              Ver Sitio Web <span aria-hidden="true">↗</span>
            </Link>
            <button
              className="admin-logout"
              onClick={() => setConfirmLogout(true)}
            >
              Cerrar Sesión
            </button>
          </div>
        </aside>
        <section
          className="admin-main"
          id="admin-content"
          aria-label="Panel de Administración"
        >
          <Routes>
            <Route index element={<Overview session={session} />} />
            <Route path="usuarios" element={<Users session={session} />} />
            <Route path="servicios" element={<Services />} />
            <Route path="citas" element={<Appointments />} />
            <Route path="reportes" element={<Reports />} />
            <Route path="categorias" element={<CategoriesAdmin />} />
            <Route path="ordenes" element={<OrdersAdmin />} />
            <Route path="criticos" element={<CriticalServices />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </section>
      </div>
      <Modal
        show={confirmLogout}
        onHide={() => setConfirmLogout(false)}
        centered
        aria-labelledby="logout-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="logout-title">Cerrar sesión</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Seguro que deseas cerrar sesión?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmLogout(false)}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              logoutSession()
              navigate('/login', { replace: true })
            }}
          >
            Confirmar cierre de sesión
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
