import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useSearchParams } from 'react-router-dom'
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import { serviceList, today } from '../lib/admin'
import {
  availableTimes,
  bookAppointment,
  validBookingDate,
} from '../lib/booking'
import { useAdminData } from '../lib/useAdminData'
import { useSession } from '../lib/useSession'

export default function AgendarCita() {
  const session = useSession()
  const services = useAdminData(serviceList)
  const [search] = useSearchParams()
  const location = useLocation()
  const [values, setValues] = useState({
    servicioId: search.get('servicio') || '',
    fecha: '',
    hora: '',
    motivo: '',
  })
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(null)
  const [saving, setSaving] = useState(false)
  const [availability, setAvailability] = useState(null)
  const [attempt, setAttempt] = useState(0)
  const service = services.find(
    (item) => item.activo !== false && String(item.id) === values.servicioId,
  )
  const { servicioId, fecha } = values
  const canCheck = Boolean(session && service && validBookingDate(fecha))
  const availabilityKey = `${servicioId}/${fecha}/${attempt}`
  const currentAvailability =
    availability?.key === availabilityKey ? availability : null
  const times = canCheck ? (currentAvailability?.times ?? []) : []
  const loading = canCheck && !currentAvailability

  useEffect(() => {
    if (!canCheck) return
    let active = true
    availableTimes(servicioId, fecha)
      .then((times) => {
        if (active) setAvailability({ key: availabilityKey, times })
      })
      .catch((failure) => {
        if (active)
          setAvailability({
            key: availabilityKey,
            times: [],
            error: failure.message,
          })
      })
    return () => {
      active = false
    }
  }, [availabilityKey, canCheck, fecha, servicioId])

  const change = (key, value) => {
    setValues((previous) => ({
      ...previous,
      [key]: value,
      ...(['fecha', 'servicioId'].includes(key) ? { hora: '' } : {}),
    }))
    setError('')
  }
  const submit = async (event) => {
    event.preventDefault()
    if (saved || saving || !times.includes(values.hora)) return
    setSaving(true)
    setError('')
    try {
      setSaved(await bookAppointment(values))
    } catch (failure) {
      setError(
        failure.message || 'No se pudo guardar la cita. Inténtalo nuevamente.',
      )
      if (failure.status === 409) {
        setValues((previous) => ({ ...previous, hora: '' }))
        setAttempt((previous) => previous + 1)
      }
    } finally {
      setSaving(false)
    }
  }
  if (!session)
    return (
      <Navigate
        to="/login"
        replace
        state={{ returnTo: location.pathname + location.search }}
      />
    )
  return (
    <Container className="py-5" style={{ maxWidth: 820 }}>
      <p className="eyebrow">RESERVA TU ATENCIÓN</p>
      <h1 className="h2">Agendar cita</h1>
      {saved ? (
        <Card className="p-4">
          <Alert variant="success" role="status">
            ¡Cita agendada con éxito! Tu reserva quedó guardada.
          </Alert>
          <h2 className="h4">{saved.servicioNombre}</h2>
          <p>
            {saved.fecha} a las {saved.hora} · {saved.doctor}
          </p>
          <p>Estado: Pendiente</p>
          <Button as={Link} to="/citas" variant="success">
            Ver mis citas
          </Button>
        </Card>
      ) : (
        <Card className="p-3 p-md-4">
          <Card.Body>
            <p>
              Reserva a nombre de <strong>{session.nombre}</strong>. Atendemos
              de lunes a viernes, entre las 09:00 y las 19:00.
            </p>
            {error && (
              <Alert variant="danger" role="alert">
                {error}
              </Alert>
            )}
            {!services.some((item) => item.activo !== false) ? (
              <Alert variant="info">
                No hay servicios disponibles para agendar.{' '}
                <Link to="/contacto">Contáctanos</Link>.
              </Alert>
            ) : (
              <Form noValidate onSubmit={submit}>
                <Row className="g-3">
                  <Col xs={12}>
                    <Form.Group controlId="booking-service">
                      <Form.Label>Servicio</Form.Label>
                      <Form.Select
                        required
                        value={values.servicioId}
                        onChange={(event) =>
                          change('servicioId', event.target.value)
                        }
                      >
                        <option value="">Selecciona un servicio</option>
                        {services
                          .filter((item) => item.activo !== false)
                          .map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.titulo}
                            </option>
                          ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="booking-doctor">
                      <Form.Label>Profesional</Form.Label>
                      <Form.Control
                        readOnly
                        value={service?.doctor || ''}
                        placeholder="Selecciona un servicio"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="booking-mode">
                      <Form.Label>Modalidad</Form.Label>
                      <Form.Control readOnly value={service?.modalidad || ''} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="booking-date">
                      <Form.Label>Fecha</Form.Label>
                      <Form.Control
                        required
                        type="date"
                        min={today()}
                        value={values.fecha}
                        onChange={(event) =>
                          change('fecha', event.target.value)
                        }
                        aria-describedby="booking-date-help"
                      />
                      <Form.Text id="booking-date-help">
                        Selecciona un día de lunes a viernes.
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="booking-time">
                      <Form.Label>Hora</Form.Label>
                      <Form.Select
                        required
                        disabled={saving || loading || !times.length}
                        value={values.hora}
                        onChange={(event) => change('hora', event.target.value)}
                      >
                        <option value="">
                          {loading
                            ? 'Consultando horarios…'
                            : 'Selecciona una hora'}
                        </option>
                        {times.map((time) => (
                          <option key={time}>{time}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  {canCheck && currentAvailability?.error && (
                    <Col xs={12}>
                      <Alert variant="danger" role="alert">
                        {currentAvailability.error}{' '}
                        <Button
                          variant="link"
                          onClick={() => setAttempt((previous) => previous + 1)}
                        >
                          Reintentar
                        </Button>
                      </Alert>
                    </Col>
                  )}
                  {canCheck &&
                    currentAvailability &&
                    !currentAvailability.error &&
                    !times.length && (
                      <Col xs={12}>
                        <Alert variant="info">
                          No hay horarios disponibles para este profesional en
                          la fecha elegida. Selecciona otro día.
                        </Alert>
                      </Col>
                    )}
                  <Col xs={12}>
                    <Form.Group controlId="booking-reason">
                      <Form.Label>Motivo de consulta (opcional)</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        maxLength={500}
                        value={values.motivo}
                        onChange={(event) =>
                          change('motivo', event.target.value)
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <div className="d-flex flex-wrap gap-3 mt-4">
                  <Button
                    type="submit"
                    variant="success"
                    disabled={saving || !times.includes(values.hora)}
                  >
                    {saving ? 'Guardando cita…' : 'Confirmar cita'}
                  </Button>
                  <Button as={Link} to="/catalogo" variant="outline-secondary">
                    Volver al catálogo
                  </Button>
                </div>
              </Form>
            )}
          </Card.Body>
        </Card>
      )}
    </Container>
  )
}
