import { Container, Row, Col, Card, Carousel } from 'react-bootstrap'
import { readStored } from '../lib/storage'

export default function Nosotros() {
  const stored = ['nutrivida_usuarios', 'usuarios']
    .flatMap((key) => {
      const users = readStored(key, [])
      return Array.isArray(users) ? users : []
    })
    .filter(
      (user) =>
        user.rol === 'medico' ||
        (user.correo || user.email || '').endsWith('@clinnutrivida.cl'),
    )
  const team = stored.length
    ? [
        ...new Map(
          stored.map((user) => [user.correo || user.email, user]),
        ).values(),
      ]
    : [
        { nombre: 'Camila Rojas', correo: 'c.rojas@clinnutrivida.cl' },
        { nombre: 'Ignacio Fuentes', correo: 'i.fuentes@clinnutrivida.cl' },
      ]
  return (
    <Container className="py-5">
      <p className="eyebrow">DESDE 2018 · TEMUCO</p>
      <h1>Sobre NutriVida</h1>
      <Row className="g-5 my-3">
        <Col lg={7}>
          <h2>Nuestra historia</h2>
          <p>
            NutriVida nació en 2018 en Temuco con una idea simple: la buena
            alimentación no debería ser complicada ni intimidante. Comenzamos
            como una consulta pequeña atendida por una sola nutricionista y, con
            el tiempo, fuimos sumando talleres grupales, planes especializados y
            un equipo comprometido con acompañar a cada paciente en su propio
            ritmo.
          </p>
          <p>
            Hoy seguimos creciendo, pero mantenemos lo mismo que nos hizo
            empezar: escuchar primero, y recién después proponer un plan.
          </p>
        </Col>
        <Col lg={5}>
          <div className="feature">
            <h2>Nuestra misión</h2>
            <p>
              Entregar asesoría nutricional personalizada, basada en evidencia y
              adaptada a la realidad de cada persona, promoviendo hábitos
              sostenibles en el tiempo.
            </p>
          </div>
        </Col>
      </Row>
      <h2 className="mb-4">Nuestro equipo</h2>
      <Row className="g-4 mb-5">
        {team.map((person) => {
          const name =
            person.nombre || person.nombres || 'Profesional NutriVida'
          return (
            <Col md={6} key={person.correo || person.email}>
              <Card className="p-4">
                <div className="team-avatar" aria-hidden="true">
                  {name
                    .split(' ')
                    .map((word) => word[0])
                    .slice(0, 2)
                    .join('')}
                </div>
                <Card.Body>
                  <h3 className="h4">{name}</h3>
                  <p>Nutricionista clínico</p>
                  <a href={`mailto:${person.correo || person.email}`}>
                    {person.correo || person.email}
                  </a>
                </Card.Body>
              </Card>
            </Col>
          )
        })}
      </Row>
      <h2 className="mb-4">Conoce nuestro espacio</h2>
      <Carousel
        interval={null}
        prevLabel="Imagen anterior"
        nextLabel="Siguiente imagen"
      >
        {[
          ['recepcion', 'Recepción de la clínica NutriVida'],
          ['consulta', 'Sala de consulta nutricional'],
          ['talleres', 'Sala de talleres grupales'],
        ].map(([file, alt]) => (
          <Carousel.Item key={file}>
            <img className="clinic-image" src={`/${file}.jpg`} alt={alt} />
            <Carousel.Caption>
              <h3>{alt}</h3>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </Container>
  )
}
