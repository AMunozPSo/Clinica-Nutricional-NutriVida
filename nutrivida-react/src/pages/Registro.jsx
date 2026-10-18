import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import { LOCATIONS, registerUser } from '../lib/registration'

const initial = {
  nombre: '',
  run: '',
  telefono: '',
  correo: '',
  password: '',
  confirmPassword: '',
  direccion: '',
  region: '',
  comuna: '',
}
export default function Registro() {
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})
  const [failure, setFailure] = useState('')
  const navigate = useNavigate()
  const { state } = useLocation()
  const change = (key, value) => {
    setValues((previous) => ({
      ...previous,
      [key]: value,
      ...(key === 'region' ? { comuna: '' } : {}),
    }))
    setErrors((previous) => ({
      ...previous,
      [key]: '',
      ...(key === 'region' ? { comuna: '' } : {}),
    }))
    setFailure('')
  }
  const submit = (event) => {
    event.preventDefault()
    try {
      const next = registerUser(values)
      setErrors(next)
      if (!Object.keys(next).length)
        navigate('/login', {
          replace: true,
          state: { registroExitoso: true, returnTo: state?.returnTo },
        })
    } catch {
      setFailure(
        'No se pudo guardar tu cuenta. Revisa el almacenamiento del navegador e inténtalo nuevamente.',
      )
    }
  }
  return (
    <Container className="py-5">
      <Card className="mx-auto p-3 p-md-4" style={{ maxWidth: 760 }}>
        <Card.Body>
          <p className="eyebrow">BIENVENIDO A NUTRIVIDA</p>
          <h1 className="h2">Crear una cuenta</h1>
          <p className="text-secondary mb-4">
            Completa tus datos para registrarte en nuestra clínica.
          </p>
          {failure && (
            <Alert variant="danger" role="alert">
              {failure}
            </Alert>
          )}
          <Form noValidate onSubmit={submit}>
            <Row className="g-3">
              {[
                [
                  'nombre',
                  'Nombre completo',
                  'text',
                  'name',
                  'Ingresa tu nombre completo',
                  100,
                ],
                ['run', 'RUN', 'text', 'off', '12345678-9', 10],
                ['telefono', 'Teléfono', 'tel', 'tel-national', '912345678', 9],
                [
                  'correo',
                  'Correo electrónico',
                  'email',
                  'email',
                  'nombre@ejemplo.com',
                  100,
                ],
                [
                  'password',
                  'Contraseña',
                  'password',
                  'new-password',
                  'Al menos 6 caracteres',
                  128,
                ],
                [
                  'confirmPassword',
                  'Repetir contraseña',
                  'password',
                  'new-password',
                  'Vuelve a escribir tu contraseña',
                  128,
                ],
                [
                  'direccion',
                  'Dirección (calle y número)',
                  'text',
                  'street-address',
                  'Av. Alemania 671',
                  200,
                ],
              ].map(
                ([key, label, type, autoComplete, placeholder, maxLength]) => (
                  <Col md={key === 'direccion' ? 12 : 6} key={key}>
                    <Form.Group controlId={`register-${key}`}>
                      <Form.Label>{label}</Form.Label>
                      <Form.Control
                        required
                        type={type}
                        autoComplete={autoComplete}
                        maxLength={maxLength}
                        placeholder={placeholder}
                        value={values[key]}
                        onChange={(event) => change(key, event.target.value)}
                        isInvalid={!!errors[key]}
                        aria-describedby={
                          errors[key] ? `register-${key}-error` : undefined
                        }
                      />
                      <Form.Control.Feedback
                        type="invalid"
                        id={`register-${key}-error`}
                      >
                        {errors[key]}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                ),
              )}
              {[
                ['region', 'Región', Object.keys(LOCATIONS)],
                ['comuna', 'Comuna', LOCATIONS[values.region] || []],
              ].map(([key, label, options]) => (
                <Col md={6} key={key}>
                  <Form.Group controlId={`register-${key}`}>
                    <Form.Label>{label}</Form.Label>
                    <Form.Select
                      required
                      disabled={key === 'comuna' && !values.region}
                      value={values[key]}
                      isInvalid={!!errors[key]}
                      aria-describedby={
                        errors[key] ? `register-${key}-error` : undefined
                      }
                      onChange={(event) => change(key, event.target.value)}
                    >
                      <option value="">
                        {key === 'comuna' && !values.region
                          ? 'Selecciona primero una región'
                          : `Selecciona una ${label.toLowerCase()}`}
                      </option>
                      {options.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback
                      type="invalid"
                      id={`register-${key}-error`}
                    >
                      {errors[key]}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              ))}
            </Row>
            <Button
              type="submit"
              variant="success"
              className="w-100 mt-4 fw-bold"
            >
              Registrarme
            </Button>
          </Form>
          <p className="text-center mt-4 mb-0">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="fw-semibold">
              Iniciar sesión
            </Link>
          </p>
        </Card.Body>
      </Card>
    </Container>
  )
}
