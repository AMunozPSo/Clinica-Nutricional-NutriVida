import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom'
import Navigation from './components/Navbar'
import Inicio from './pages/Inicio'
import Catalogo from './pages/Catalogo'
import Contacto from './pages/Contacto'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Perfil from './pages/Perfil'
import MisCitas from './pages/MisCitas'
import AgendarCita from './pages/AgendarCita'
import Categorias from './pages/shop/Categorias'
import Cart from './pages/shop/Cart'
import Checkout from './pages/shop/Checkout'
import OrderResult from './pages/shop/OrderResult'
import Orders from './pages/shop/Orders'
import Blog from './pages/content/Blog'
import Doctor from './pages/content/Doctor'
import Progress from './pages/content/Progress'
import Plan from './pages/content/Plan'
import DetalleServicio from './pages/DetalleServicio'
import Nosotros from './pages/Nosotros'
import Footer from './components/Footer'
import Admin from './pages/Admin'

function AppContent() {
  const { pathname, search } = useLocation()
  const adminPage = pathname === '/admin' || pathname.startsWith('/admin/')
  return (
    <>
      {!adminPage && <Navigation />}
      <main id="contenido" style={adminPage ? { paddingBottom: 0 } : undefined}>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/ofertas" element={<Catalogo />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/compra/:resultado/:id" element={<OrderResult />} />
          <Route path="/compras" element={<Orders />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<Blog />} />
          <Route path="/doctor" element={<Doctor />} />
          <Route path="/historial" element={<Progress />} />
          <Route path="/plan" element={<Plan />} />
          {Object.entries({
            'blogs.html': '/blog',
            'blog-1.html': '/blog/1',
            'blog-2.html': '/blog/2',
            'panel-doctor.html': '/doctor',
            'historial.html': '/historial',
            'plan-alimenticio.html': '/plan',
            'catalogo.html': '/catalogo',
            'index.html': '/',
            'contacto.html': '/contacto',
            'nosotros.html': '/nosotros',
            'login.html': '/login',
          }).map(([path, to]) => (
            <Route
              key={path}
              path={`/${path}`}
              element={<Navigate to={to} replace />}
            />
          ))}
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/citas" element={<MisCitas />} />
          <Route path="/agendar" element={<AgendarCita />} />
          <Route
            path="/solicitud-cita.html"
            element={<Navigate to={`/agendar${search}`} replace />}
          />
          <Route
            path="/perfil.html"
            element={<Navigate to="/perfil" replace />}
          />
          <Route
            path="/citas.html"
            element={<Navigate to="/citas" replace />}
          />
          <Route
            path="/registro.html"
            element={<Navigate to="/registro" replace />}
          />
          <Route path="/servicio/:id" element={<DetalleServicio />} />
          <Route path="/admin/*" element={<Admin />} />
          {Object.entries({
            'home-admin.html': '/admin',
            'mantenedor-usuarios.html': '/admin/usuarios',
            'admin-catalogo.html': '/admin/servicios',
            'mantenedor-servicios.html': '/admin/servicios',
            'gestor-citas.html': '/admin/citas',
            'admin-reportes.html': '/admin/reportes',
          }).map(([path, to]) => (
            <Route
              key={path}
              path={`/${path}`}
              element={<Navigate to={to} replace />}
            />
          ))}
          <Route path="/nosotros" element={<Nosotros />} />
          <Route
            path="*"
            element={
              <div className="container py-5">
                <h1>Página no encontrada</h1>
                <a href="/">Volver al inicio</a>
              </div>
            }
          />
        </Routes>
      </main>
      {!adminPage && <Footer />}
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
