import { Container, Form, Button, Card } from 'react-bootstrap'

function Login() {
  return (
    <Container className="mt-5 d-flex justify-content-center">
      <Card className="shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <Card.Body>
          <h2 className="text-center text-success mb-4">Iniciar Sesión</h2>
          <Form>
            <Form.Group className="mb-3" controlId="emailLogin">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control type="email" placeholder="Ingresa tu correo" required />
            </Form.Group>

            <Form.Group className="mb-4" controlId="passwordLogin">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control type="password" placeholder="Ingresa tu contraseña" required />
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