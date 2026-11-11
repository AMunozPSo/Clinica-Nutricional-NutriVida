import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Alert, Button, Container, Form, Table } from 'react-bootstrap'
import {
  doctorAppointments,
  planPatients,
  assignPlan,
} from '../../lib/clinical'
import { useSession } from '../../lib/useSession'
import { useAdminData } from '../../lib/useAdminData'
import { readProfessionals } from '../../lib/api'

const emptyPlan = {
  pacienteId: '',
  profesionalId: '',
  titulo: '',
  contenido: '',
}

export default function Doctor() {
  const session = useSession()
  const appointments = useAdminData(doctorAppointments)
  const patients = useAdminData(planPatients)
  const professionals = useAdminData(readProfessionals)
  const [values, setValues] = useState(emptyPlan)
  const [notice, setNotice] = useState(null)
  const [saving, setSaving] = useState(false)
  if (!session) return <Navigate to="/login" replace />
  if (!session.esAdmin && session.rol !== 'medico')
    return <Navigate to="/" replace />
  const submit = async (event) => {
    event.preventDefault()
    if (saving) return
    setSaving(true)
    setNotice(null)
    try {
      await assignPlan(values)
      setNotice({ variant: 'success', message: 'Plan guardado correctamente.' })
      setValues(emptyPlan)
    } catch (error) {
      setNotice({ variant: 'danger', message: error.message })
    } finally {
      setSaving(false)
    }
  }
  return (
    <Container className="py-5">
      <h1 className="h2">Agenda médica de {session.nombre}</h1>
      <p>
        {session.esAdmin
          ? 'Vista general de la agenda clínica.'
          : 'Citas asignadas a tu cuenta profesional.'}
      </p>
      {!appointments.length ? (
        <Alert variant="info">No tienes citas asignadas.</Alert>
      ) : (
        <Table responsive>
          <thead>
            <tr>
              <th>Fecha y hora</th>
              <th>Paciente</th>
              <th>Servicio</th>
              <th>Motivo</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((item) => (
              <tr key={item.uid}>
                <td>
                  {item.fecha} {item.hora}
                </td>
                <td>{item.pacienteNombre || item.pacienteCorreo}</td>
                <td>{item.servicioNombre}</td>
                <td>{item.motivo || 'Sin motivo especificado'}</td>
                <td>{item.estado}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <h2 className="h4 mt-5">Asignar plan alimenticio</h2>
      {notice && (
        <Alert role="status" variant={notice.variant}>
          {notice.message}
        </Alert>
      )}
      {patients.length ? (
        <Form className="bg-white p-4 rounded-4" onSubmit={submit}>
          <Form.Group controlId="plan-patient" className="mb-3">
            <Form.Label>Paciente</Form.Label>
            <Form.Select
              required
              value={values.pacienteId}
              onChange={(event) =>
                setValues({ ...values, pacienteId: event.target.value })
              }
            >
              <option value="">Selecciona un paciente</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          {session.esAdmin && (
            <Form.Group controlId="plan-professional" className="mb-3">
              <Form.Label>Profesional responsable</Form.Label>
              <Form.Select
                required
                value={values.profesionalId}
                onChange={(event) =>
                  setValues({ ...values, profesionalId: event.target.value })
                }
              >
                <option value="">Selecciona un profesional</option>
                {professionals.map((professional) => (
                  <option key={professional.id} value={professional.id}>
                    {professional.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          )}
          <Form.Group controlId="plan-title" className="mb-3">
            <Form.Label>Título del plan</Form.Label>
            <Form.Control
              required
              maxLength={100}
              value={values.titulo}
              onChange={(event) =>
                setValues({ ...values, titulo: event.target.value })
              }
            />
          </Form.Group>
          <Form.Group controlId="plan-content" className="mb-3">
            <Form.Label>Indicaciones del profesional</Form.Label>
            <Form.Control
              required
              as="textarea"
              rows={5}
              maxLength={3000}
              value={values.contenido}
              onChange={(event) =>
                setValues({ ...values, contenido: event.target.value })
              }
            />
          </Form.Group>
          <Button type="submit" variant="success" disabled={saving}>
            {saving ? 'Guardando plan…' : 'Guardar plan'}
          </Button>
        </Form>
      ) : (
        <p>No hay pacientes disponibles en tu agenda.</p>
      )}
      <Link className="d-block mt-4" to="/perfil">
        Mi perfil
      </Link>
    </Container>
  )
}
