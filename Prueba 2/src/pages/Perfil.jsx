import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import { readProfile, updateProfile } from '../lib/account'
import { useSession } from '../lib/useSession'
import { LOCATIONS } from '../lib/registration'

function ProfileForm({ profile }) {
  const [values, setValues] = useState({
    nombre: profile.nombre || '',
    telefono: profile.telefono || '',
    direccion: profile.direccion || '',
    region: profile.region || '',
    comuna: profile.comuna || '',
  })
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState(null)
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
    setNotice(null)
  }
  const submit = (event) => {
    event.preventDefault()
    try {
      const next = updateProfile(values)
      setErrors(next)
      setNotice(
        Object.keys(next).length
          ? null
          : { type: 'success', text: 'Tus datos se guardaron correctamente.' },
      )
    } catch (error) {
      setNotice({
        type: 'danger',
        text: error.message || 'No se pudieron guardar tus datos.',
      })
    }
  }
  return (
    <Card className="p-3 p-md-4">
      <Card.Body>
        {notice && (
          <Alert variant={notice.type} role="status">
            {notice.text}
          </Alert>
        )}
        <Form noValidate onSubmit={submit}>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group controlId="profile-email">
                <Form.Label>Correo electrónico</Form.Label>
                <Form.Control type="email" value={profile.correo} readOnly />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="profile-run">
                <Form.Label>RUN</Form.Label>
                <Form.Control value={profile.run || 'Sin registrar'} readOnly />
              </Form.Group>
            </Col>
            {[
              ['nombre', 'Nombre completo', 'text', 'name', 100],
              ['telefono', 'Teléfono', 'tel', 'tel-national', 9],
              [
                'direccion',
                'Dirección (calle y número)',
                'text',
                'street-address',
                200,
              ],
            ].map(([key, label, type, autoComplete, maxLength]) => (
              <Col key={key} md={key === 'direccion' ? 12 : 6}>
                <Form.Group controlId={`profile-${key}`}>
                  <Form.Label>{label}</Form.Label>
                  <Form.Control
                    type={type}
                    required
                    maxLength={maxLength}
                    autoComplete={autoComplete}
                    value={values[key]}
                    onChange={(event) => change(key, event.target.value)}
                    isInvalid={!!errors[key]}
                    aria-describedby={
                      errors[key] ? `profile-${key}-error` : undefined
                    }
                  />
                  <Form.Control.Feedback
                    type="invalid"
                    id={`profile-${key}-error`}
                  >
                    {errors[key]}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            ))}
            {[
              ['region', 'Región', Object.keys(LOCATIONS)],
              ['comuna', 'Comuna', LOCATIONS[values.region] || []],
            ].map(([key, label, options]) => (
              <Col md={6} key={key}>
                <Form.Group controlId={`profile-${key}`}>
                  <Form.Label>{label}</Form.Label>
                  <Form.Select
                    disabled={key === 'comuna' && !values.region}
                    value={values[key]}
                    onChange={(event) => change(key, event.target.value)}
                    isInvalid={!!errors[key]}
                    aria-describedby={
                      errors[key] ? `profile-${key}-error` : undefined
                    }
                  >
                    <option value="">
                      {key === 'comuna' && !values.region
                        ? 'Selecciona primero una región'
                        : `Selecciona una ${label.toLowerCase()}`}
                    </option>
                    {values[key] && !options.includes(values[key]) && (
                      <option>{values[key]}</option>
                    )}
                    {options.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback
                    type="invalid"
                    id={`profile-${key}-error`}
                  >
                    {errors[key]}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            ))}
          </Row>
          <Button type="submit" variant="success" className="mt-4">
            Guardar cambios
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}
export default function Perfil() {
  const session = useSession()
  if (!session) return <Navigate to="/login" replace />
  const profile = readProfile()
  return (
    <Container className="py-5" style={{ maxWidth: 820 }}>
      <p className="eyebrow">TU CUENTA NUTRIVIDA</p>
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
        <h1 className="h2 m-0">Mi perfil</h1>
        <Button as={Link} to="/citas" variant="outline-success">
          Ver mis citas
        </Button>
      </div>
      <p className="text-secondary">
        Actualiza tus datos personales y de contacto.
      </p>
      {profile ? (
        <ProfileForm key={session.correo} profile={profile} />
      ) : (
        <Alert variant="warning">
          No se encontraron los datos de tu cuenta. Vuelve a iniciar sesión.
        </Alert>
      )}
    </Container>
  )
}
