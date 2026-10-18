import { Link } from 'react-router-dom'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { readCategories } from '../../lib/commerce'
import { useAdminData } from '../../lib/useAdminData'
export default function Categorias() {
  const categories = useAdminData(readCategories)
  return (
    <Container className="py-5">
      <p className="eyebrow">ENCUENTRA TU ATENCIÓN</p>
      <h1 className="h2">Categorías</h1>
      <Row className="g-4 mt-2">
        {categories.map((item) => (
          <Col md={6} lg={4} key={item.id}>
            <Card className="h-100 p-3">
              <Card.Body>
                <h2 className="h4">{item.nombre}</h2>
                <Button
                  as={Link}
                  to={`/catalogo?categoria=${encodeURIComponent(item.id)}`}
                  variant="outline-success"
                >
                  Ver servicios de {item.nombre}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {!categories.length && <p>No hay categorías publicadas.</p>}
    </Container>
  )
}
