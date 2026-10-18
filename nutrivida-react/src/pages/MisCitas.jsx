import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import {
  Alert,
  Badge,
  Button,
  Container,
  Form,
  Modal,
  Table,
} from 'react-bootstrap'
import { cancelMyAppointment, readMyAppointments } from '../lib/account'
import { useSession } from '../lib/useSession'
import { useAdminData } from '../lib/useAdminData'

const variants = {
  Pendiente: 'warning',
  Confirmada: 'primary',
  Completada: 'success',
  Cancelada: 'secondary',
}
export default function MisCitas() {
  const session = useSession()
  const appointments = useAdminData(readMyAppointments)
  const [state, setState] = useState('Todas')
  const [pending, setPending] = useState(null)
  const [notice, setNotice] = useState('')
  if (!session) return <Navigate to="/login" replace />
  const filtered = appointments.filter(
    (item) => state === 'Todas' || item.estado === state,
  )
  return (
    <Container className="py-5">
      <p className="eyebrow">TU ATENCIÓN EN NUTRIVIDA</p>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
        <h1 className="h2 m-0">Mis citas</h1>
        <div className="d-flex gap-2">
          <Button as={Link} to="/agendar" variant="success">
            Agendar nueva cita
          </Button>
          <Button as={Link} to="/perfil" variant="outline-success">
            Mi perfil
          </Button>
        </div>
      </div>
      <p className="text-secondary">
        Consulta las citas guardadas de tu cuenta, sus profesionales y su
        estado.
      </p>
      {notice && <Alert role="status">{notice}</Alert>}
      {!appointments.length ? (
        <Alert variant="info">
          No tienes citas registradas.{' '}
          <Link to="/catalogo">Conoce nuestros servicios</Link>.
        </Alert>
      ) : (
        <>
          <Form.Group
            controlId="my-appointments-state"
            className="mb-4"
            style={{ maxWidth: 300 }}
          >
            <Form.Label>Filtrar por estado</Form.Label>
            <Form.Select
              value={state}
              onChange={(event) => setState(event.target.value)}
            >
              <option>Todas</option>
              {Object.keys(variants).map((value) => (
                <option key={value}>{value}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <p className="small text-secondary">
            {filtered.length} de {appointments.length} citas
          </p>
          <div className="bg-white rounded-4 shadow-sm p-3">
            <Table responsive className="align-middle mb-0">
              <caption className="visually-hidden">
                Citas guardadas de {session.nombre}
              </caption>
              <thead>
                <tr>
                  {[
                    'Fecha y hora',
                    'Servicio',
                    'Profesional',
                    'Modalidad',
                    'Estado',
                    'Acciones',
                  ].map((label) => (
                    <th key={label} scope="col">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length ? (
                  filtered.map((item) => (
                    <tr key={item.uid}>
                      <td className="text-nowrap">
                        {item.fecha || 'Por coordinar'}
                        <small className="d-block text-secondary">
                          {item.hora || 'Hora por coordinar'}
                        </small>
                      </td>
                      <td>
                        {item.servicioNombre}
                        {item.motivo && (
                          <small className="d-block text-secondary">
                            {item.motivo}
                          </small>
                        )}
                      </td>
                      <td>{item.doctor || 'Por asignar'}</td>
                      <td>{item.modalidad || 'Presencial'}</td>
                      <td>
                        <Badge
                          bg={variants[item.estado] || 'secondary'}
                          text={
                            item.estado === 'Pendiente' ? 'dark' : undefined
                          }
                        >
                          {item.estado}
                        </Badge>
                      </td>
                      <td>
                        {!['Completada', 'Cancelada'].includes(item.estado) && (
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => setPending(item)}
                          >
                            Cancelar cita
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      No tienes citas con este estado.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </>
      )}
      <Modal
        show={!!pending}
        onHide={() => setPending(null)}
        centered
        aria-labelledby="cancel-booking-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="cancel-booking-title">Cancelar cita</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Cancelar tu cita de {pending?.servicioNombre} del {pending?.fecha} a
          las {pending?.hora}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setPending(null)}>
            Volver
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              try {
                cancelMyAppointment(pending.uid)
                setNotice('Cita cancelada. El horario quedó disponible.')
              } catch (error) {
                setNotice(error.message)
              }
              setPending(null)
            }}
          >
            Confirmar cancelación
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}
