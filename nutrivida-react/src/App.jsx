import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navbar'
import Inicio from './pages/Inicio'

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<Inicio />} />
        {/* Aquí agregaremos las demás rutas luego */}
      </Routes>
    </BrowserRouter>
  )
}

export default App