import { Container, Row, Col, Button } from 'react-bootstrap'

export default function Inicio() {
  return (
    <>
      <section className="hero">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <p className="eyebrow">NUTRICIÓN CON SENTIDO · TEMUCO</p>
              <h1>Bienvenido a Clínica NutriVida</h1>
              <p className="lead my-4">
                Tu salud nutricional en las mejores manos.
              </p>
              <p>
                Escuchamos tu historia y construimos contigo una alimentación
                que se adapte a tu vida. Sin dietas genéricas ni promesas
                irreales.
              </p>
              <div className="d-flex flex-wrap gap-3 mt-4">
                <Button href="/catalogo" variant="success" size="lg">
                  Conoce nuestros servicios
                </Button>
                <Button href="/nosotros" variant="outline-success" size="lg">
                  Nuestro equipo
                </Button>
              </div>
            </Col>
            <Col lg={6}>
              <img
                className="hero-image"
                src="/recepcion.jpg"
                alt="Recepción de Clínica NutriVida"
              />
            </Col>
          </Row>
        </Container>
      </section>
      <Container className="py-5">
        <p className="eyebrow">A TU RITMO, CONTIGO</p>
        <h2 className="mb-4">Pequeños hábitos. Bienestar duradero.</h2>
        <Row className="g-4">
          {[
            [
              '01',
              'Te escuchamos',
              'Cada persona tiene una historia. Conocemos tu rutina, tus necesidades y tus objetivos.',
            ],
            [
              '02',
              'Creamos tu plan',
              'Asesoría nutricional personalizada, basada en evidencia y adaptada a tu realidad.',
            ],
            [
              '03',
              'Te acompañamos',
              'Seguimiento y educación para construir hábitos que puedas mantener en el tiempo.',
            ],
          ].map(([number, title, text]) => (
            <Col md={4} key={number}>
              <article className="feature h-100">
                <span className="feature-number">{number}</span>
                <h3 className="h5 mt-3">{title}</h3>
                <p>{text}</p>
              </article>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  )
}
