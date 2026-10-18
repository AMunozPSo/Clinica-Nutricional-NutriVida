import { Link, useParams } from 'react-router-dom'
import { Button, Card, Col, Container, Row } from 'react-bootstrap'
const articles = [
  {
    id: '1',
    titulo: 'Creatina y nutrición deportiva',
    texto: [
      'En el material original de NutriVida se aborda el uso de la creatina y los mitos que la rodean. Una alimentación variada y un entrenamiento planificado son parte del contexto en que se evalúan los suplementos.',
      'La decisión de utilizar suplementos debe revisarse con el profesional que conoce tus objetivos y antecedentes. Durante la consulta puedes preguntar por la evidencia, los beneficios esperados y las precauciones para tu situación.',
    ],
    imagen: '/talleres.jpg',
  },
  {
    id: '2',
    titulo: 'El poder matutino Avena yogurt y granola',
    texto: [
      'El desayuno es una oportunidad para organizar la alimentación según tus horarios y preferencias. Avena, yogurt, fruta y granola son ingredientes que puedes conversar con tu nutricionista al planificar alternativas.',
      'Las cantidades y combinaciones dependen de cada persona. En NutriVida buscamos construir hábitos sostenibles y adaptar el plan a la rutina, las preferencias y las necesidades individuales.',
    ],
    imagen: '/consulta.jpg',
  },
]
export default function Blog() {
  const { id } = useParams()
  const article = articles.find((item) => item.id === id)
  if (id && !article)
    return (
      <Container className="py-5">
        <h1 className="h2">Artículo no encontrado</h1>
        <Link to="/blog">Volver al blog</Link>
      </Container>
    )
  return (
    <Container className="py-5">
      {article ? (
        <article style={{ maxWidth: 850 }}>
          <h1 className="h2">{article.titulo}</h1>
          <img
            className="w-100 rounded-4 my-4"
            src={article.imagen}
            alt="Espacio de atención de NutriVida"
            style={{ maxHeight: 350, objectFit: 'cover' }}
          />
          {article.texto.map((text) => (
            <p key={text}>{text}</p>
          ))}
          <p className="small text-secondary">
            Material informativo de la maqueta académica NutriVida. No
            constituye una indicación personalizada.
          </p>
          <Button as={Link} to="/blog" variant="outline-success">
            Volver al blog
          </Button>
        </article>
      ) : (
        <>
          <h1 className="h2">Blog NutriVida</h1>
          <p>Educación y hábitos de alimentación.</p>
          <Row className="g-4">
            {articles.map((item) => (
              <Col md={6} key={item.id}>
                <Card className="h-100">
                  <Card.Img
                    src={item.imagen}
                    alt="Clínica NutriVida"
                    style={{ height: 220, objectFit: 'cover' }}
                  />
                  <Card.Body>
                    <h2 className="h4">{item.titulo}</h2>
                    <p>{item.texto[0]}</p>
                    <Button as={Link} to={`/blog/${item.id}`} variant="success">
                      Leer artículo
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  )
}
