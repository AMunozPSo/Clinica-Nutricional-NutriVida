import { useState } from 'react'
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap'
import { readStored } from '../lib/storage'

export default function Contacto() {
  const [values, setValues] = useState({
    nombre: '',
    correo: '',
    comentario: '',
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('')
  const submit = (event) => {
    event.preventDefault()
    setStatus('')
    const next = {}
    if (!values.nombre.trim()) next.nombre = 'El nombre es obligatorio.'
    else if (values.nombre.length > 100) next.nombre = 'Máximo 100 caracteres.'
    if (
      !/^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(
        values.correo.trim(),
      )
    )
      next.correo =
        'Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.'
    if (!values.comentario.trim())
      next.comentario = 'El comentario es obligatorio.'
    else if (values.comentario.length > 500)
      next.comentario = 'Máximo 500 caracteres.'
    setErrors(next)
    if (Object.keys(next).length) return
    try {
      const stored = readStored('nutrivida_mensajes', [])
      const messages = Array.isArray(stored) ? stored : []
      localStorage.setItem(
        'nutrivida_mensajes',
        JSON.stringify([
          ...messages,
          {
            id: crypto.randomUUID(),
            fecha: new Date().toLocaleDateString('es-CL'),
            nombre: values.nombre.trim(),
            correo: values.correo.trim().toLowerCase(),
            comentario: values.comentario.trim(),
          },
        ]),
      )
      setValues({ nombre: '', correo: '', comentario: '' })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }
  return (
    <Container className="py-5">
      <p className="eyebrow">ESTAMOS PARA ESCUCHARTE</p>
      <h1>Contáctanos</h1>
      <p className="mb-4">
        ¿Tienes dudas sobre nuestros servicios? Escríbenos tu consulta.
      </p>
      <Row className="g-5">
        <Col lg={7}>
          {status && (
            <Alert
              variant={status === 'success' ? 'success' : 'danger'}
              role="status"
            >
              {status === 'success'
                ? '¡Gracias! Tu mensaje quedó guardado en este navegador.'
                : 'No se pudo guardar el mensaje. Revisa el almacenamiento del navegador e inténtalo nuevamente.'}
            </Alert>
          )}
          <Form
            noValidate
            onSubmit={submit}
            className="shadow-sm p-4 rounded-4 bg-white"
          >
            {[
              ['nombre', 'Nombre completo', 'text', 'Ingresa tu nombre', 100],
              [
                'correo',
                'Correo electrónico',
                'email',
                'nombre@ejemplo.com',
                100,
              ],
              [
                'comentario',
                'Mensaje o consulta',
                'text',
                '¿En qué te podemos ayudar?',
                500,
              ],
            ].map(([key, label, type, placeholder, max]) => (
              <Form.Group key={key} className="mb-3" controlId={key}>
                <Form.Label>{label}</Form.Label>
                <Form.Control
                  as={key === 'comentario' ? 'textarea' : 'input'}
                  rows={key === 'comentario' ? 5 : undefined}
                  type={type}
                  maxLength={max}
                  required
                  placeholder={placeholder}
                  value={values[key]}
                  isInvalid={!!errors[key]}
                  aria-describedby={errors[key] ? `${key}-error` : undefined}
                  onChange={(event) => {
                    setValues({ ...values, [key]: event.target.value })
                    setStatus('')
                  }}
                />
                <Form.Control.Feedback type="invalid" id={`${key}-error`}>
                  {errors[key]}
                </Form.Control.Feedback>
              </Form.Group>
            ))}
            <Button variant="success" type="submit" className="w-100 fw-bold">
              Enviar Mensaje
            </Button>
          </Form>
        </Col>
        <Col lg={5}>
          <h2 className="h4">Visita nuestra clínica</h2>
          <p>Av. Alemania 671, Temuco, Región de La Araucanía.</p>
          <iframe
            className="contact-map"
            title="Ubicación de Clínica NutriVida en Temuco"
            src="https://www.openstreetmap.org/export/embed.html?bbox=-72.608%2C-38.746%2C-72.588%2C-38.733&layer=mapnik&marker=-38.7397%2C-72.5977"
            loading="lazy"
          />
          <p className="small mt-2">Mapa: © OpenStreetMap contributors</p>
        </Col>
      </Row>
    </Container>
  )
}
