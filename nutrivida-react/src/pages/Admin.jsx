import { useState, useEffect } from 'react'
import { Container, Button, Card, Table, Form, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

function Admin() {
  const navigate = useNavigate()
  const [servicios, setServicios] = useState([])
  
  const [nuevoServicio, setNuevoServicio] = useState({
    titulo: '', descripcion: '', precio: '', imagen: '', doctor: '' 
  })

  useEffect(() => {
    const sesionActiva = localStorage.getItem('adminLogueado')
    if (!sesionActiva) {
      navigate('/login')
    } else {
      const datosGuardados = localStorage.getItem('serviciosNutriVida')
      if (datosGuardados) setServicios(JSON.parse(datosGuardados))
    }
  }, [navigate])

  const cerrarSesion = () => {
    localStorage.removeItem('adminLogueado')
    navigate('/')
  }

  const manejarAgregar = (e) => {
    e.preventDefault()
    const nuevoId = servicios.length > 0 ? Math.max(...servicios.map(s => s.id)) + 1 : 1
    const servicioAguardar = { id: nuevoId, ...nuevoServicio }
    
    const catalogoActualizado = [...servicios, servicioAguardar]
    setServicios(catalogoActualizado)
    localStorage.setItem('serviciosNutriVida', JSON.stringify(catalogoActualizado))
    
    setNuevoServicio({ titulo: '', descripcion: '', precio: '', imagen: '', doctor: '' })
  }

  const manejarEliminar = (id) => {
    const catalogoActualizado = servicios.filter(servicio => servicio.id !== id)
    setServicios(catalogoActualizado)
    localStorage.setItem('serviciosNutriVida', JSON.stringify(catalogoActualizado))
  }

  return (
    <Container className="mt-5">
      <Card className="shadow-sm border-success mb-5">
        <Card.Header className="bg-success text-white d-flex justify-content-between align-items-center">
          <h3 className="m-0">Panel de Administración</h3>
          <Button variant="danger" size="sm" onClick={cerrarSesion}>Cerrar Sesión</Button>
        </Card.Header>
        <Card.Body>
          
          <h5 className="text-success mb-3">Agregar Nuevo Servicio</h5>
          <Form onSubmit={manejarAgregar} className="mb-4 bg-light p-3 rounded">
            <Row>
              <Col md={2}>
                <Form.Control type="text" placeholder="Título" required 
                  value={nuevoServicio.titulo} 
                  onChange={(e) => setNuevoServicio({...nuevoServicio, titulo: e.target.value})} />
              </Col>
              <Col md={3}>
                <Form.Control type="text" placeholder="Descripción breve" required 
                  value={nuevoServicio.descripcion} 
                  onChange={(e) => setNuevoServicio({...nuevoServicio, descripcion: e.target.value})} />
              </Col>
              <Col md={2}>
                <Form.Control type="text" placeholder="Precio (ej: 15.000)" required 
                  value={nuevoServicio.precio} 
                  onChange={(e) => setNuevoServicio({...nuevoServicio, precio: e.target.value})} />
              </Col>
              <Col md={3}>
                <Form.Control type="text" placeholder="Dr. a cargo (ej: Juan Pérez)" required 
                  value={nuevoServicio.doctor} 
                  onChange={(e) => setNuevoServicio({...nuevoServicio, doctor: e.target.value})} />
              </Col>
              <Col md={2}>
                <Form.Control type="url" placeholder="URL de la imagen" required 
                  value={nuevoServicio.imagen} 
                  onChange={(e) => setNuevoServicio({...nuevoServicio, imagen: e.target.value})} />
              </Col>
            </Row>
            <Button variant="success" type="submit" className="mt-3">Guardar Servicio</Button>
          </Form>

          <h5 className="text-success mb-3">Servicios Actuales</h5>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Doctor</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {servicios.map((servicio) => (
                <tr key={servicio.id}>
                  <td>{servicio.id}</td>
                  <td>{servicio.titulo}</td>
                  <td>{servicio.doctor || 'No asignado'}</td>
                  <td>${servicio.precio}</td>
                  <td>
                    <Button variant="outline-danger" size="sm" onClick={() => manejarEliminar(servicio.id)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
              {servicios.length === 0 && (
                <tr><td colSpan="5" className="text-center">No hay servicios en el catálogo.</td></tr>
              )}
            </tbody>
          </Table>

        </Card.Body>
      </Card>
    </Container>
  )
}

export default Admin