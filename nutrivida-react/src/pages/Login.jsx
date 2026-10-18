import { useState } from 'react'
import { Container, Form, Button, Card, Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  
  const navigate = useNavigate()

  const manejarLogin = (e) => {
    e.preventDefault() 
    const correoValido = email === 'feli.arayah@duocuc.cl' || email === 'anto.munozp@duocuc.cl';
    
    if (correoValido && password === 'admin123') {
      localStorage.setItem('adminLogueado', 'true')
      navigate('/admin')
    } else {
      setError('Correo o contraseña incorrectos. Verifica tus credenciales de Duoc UC.')
    }
  }

  return (
    <Container className="mt-5 d-flex justify-content-center">
      <Card className="shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <Card.Body>
          <h2 className="text-center text-success mb-4">Iniciar Sesión</h2>
          
          {/* Si hay un error, mostramos esta alerta roja */}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={manejarLogin}>
            <Form.Group className="mb-3" controlId="emailLogin">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control 
                type="email" 
                placeholder="Ingresa tu correo" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="passwordLogin">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Ingresa tu contraseña" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="success" type="submit" className="w-100 fw-bold">
              Entrar
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Login