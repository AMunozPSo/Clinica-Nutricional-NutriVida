import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navbar'
import Inicio from './pages/Inicio'
import Catalogo from './pages/Catalogo'
import Contacto from './pages/Contacto'
import Login from './pages/Login'
import DetalleServicio from './pages/DetalleServicio' 

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/servicio/:id" element={<DetalleServicio />} /> 
      </Routes>
    </BrowserRouter>
  )
}

export default App