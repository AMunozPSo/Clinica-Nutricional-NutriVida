import { useEffect, useState } from 'react'
import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAdminData } from '../lib/useAdminData'
import { readCart } from '../lib/commerce'
import { readSession, logoutSession } from '../lib/storage'

export default function Navigation() {
  const [session, setSession] = useState(readSession)
  const navigate = useNavigate()
  const cart = useAdminData(readCart)
  useEffect(() => {
    const update = () => setSession(readSession())
    window.addEventListener('nutrivida-session', update)
    window.addEventListener('storage', update)
    return () => {
      window.removeEventListener('nutrivida-session', update)
      window.removeEventListener('storage', update)
    }
  }, [])
  return (
    <Navbar expand="xl" collapseOnSelect className="bg-white shadow-sm py-3">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-success">
          NutriVida<span className="brand-dot">.</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="menu-principal" aria-label="Abrir menú" />
        <Navbar.Collapse id="menu-principal">
          <Nav className="ms-auto align-items-lg-center gap-lg-1">
            {[
              ['/', 'Inicio'],
              ['/catalogo', 'Catálogo'],
              ['/nosotros', 'Nosotros'],
              ['/blog', 'Blog'],
              ['/contacto', 'Contacto'],
            ].map(([to, label]) => (
              <Nav.Link
                as={NavLink}
                key={to}
                to={to}
                end={to === '/'}
                eventKey={to}
              >
                {label}
              </Nav.Link>
            ))}
            <NavDropdown title="Servicios" id="services-menu">
              <NavDropdown.Item as={Link} to="/categorias">
                Categorías
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/ofertas">
                Ofertas
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link as={NavLink} to="/carrito" eventKey="carrito">
              Carrito ({cart.reduce((sum, item) => sum + item.cantidad, 0)})
            </Nav.Link>
            {session ? (
              <>
                <Nav.Link as={NavLink} to="/citas" eventKey="citas">
                  Mis citas
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to="/perfil"
                  eventKey="perfil"
                  className="btn btn-outline-success px-3"
                >
                  Hola {session.nombre}
                </Nav.Link>
                <NavDropdown title="Mi atención" id="account-menu">
                  <NavDropdown.Item as={Link} to="/compras">
                    Mis compras
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/historial">
                    Mi progreso
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/plan">
                    Plan alimenticio
                  </NavDropdown.Item>
                  {(session.rol === 'medico' || session.esAdmin) && (
                    <NavDropdown.Item as={Link} to="/doctor">
                      Agenda médica
                    </NavDropdown.Item>
                  )}
                </NavDropdown>
                {session.esAdmin && (
                  <Nav.Link as={NavLink} to="/admin" eventKey="admin">
                    Ir al Panel
                  </Nav.Link>
                )}
                <Button
                  variant="outline-success"
                  onClick={() => {
                    logoutSession()
                    navigate('/')
                  }}
                >
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <Nav.Link
                as={NavLink}
                to="/login"
                eventKey="login"
                className="btn btn-outline-success px-3"
              >
                Iniciar Sesión
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
