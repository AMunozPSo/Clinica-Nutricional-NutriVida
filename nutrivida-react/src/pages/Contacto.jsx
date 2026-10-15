import { Container, Form, Button } from 'react-bootstrap'

function Contacto() {
  return (
    <Container className="mt-5">
      <h2 className="text-success text-center mb-4">Contáctanos</h2>
      
      {/* El estilo maxWidth asegura que el formulario no se estire demasiado en pantallas gigantes */}
      <Form className="mx-auto shadow p-4 rounded bg-white" style={{ maxWidth: '600px' }}>
        <Form.Group className="mb-3" controlId="nombre">
          <Form.Label>Nombre completo</Form.Label>
          <Form.Control type="text" placeholder="Ingresa tu nombre" required />
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Correo electrónico</Form.Label>
          <Form.Control type="email" placeholder="nombre@ejemplo.com" required />
        </Form.Group>

        <Form.Group className="mb-3" controlId="mensaje">
          <Form.Label>Mensaje o consulta</Form.Label>
          <Form.Control as="textarea" rows={4} placeholder="¿En qué te podemos ayudar?" required />
        </Form.Group>

        <Button variant="success" type="submit" className="w-100 fw-bold">
          Enviar Mensaje
        </Button>
      </Form>
    </Container>
  )
}

export default Contacto