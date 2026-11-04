import { Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <Container>
        <div className="d-flex flex-wrap justify-content-between gap-4 mb-4">
          <div>
            <Link
              to="/"
              className="fs-4 fw-bold text-white text-decoration-none"
            >
              NutriVida.
            </Link>
            <p className="mt-2">Escuchamos primero. Te acompañamos siempre.</p>
          </div>
          <div>
            <p>Av. Alemania 671, Temuco</p>
            <Link to="/contacto" className="text-white">
              Contáctanos
            </Link>
            <span className="mx-3">·</span>
            <Link to="/nosotros" className="text-white">
              Nuestro equipo
            </Link>
          </div>
        </div>
        <p className="footer-legal">
          © 2026 Clínica NutriVida. Todos los derechos reservados.
        </p>
      </Container>
    </footer>
  )
}
