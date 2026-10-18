import { useState } from 'react'
import { Alert, Button, Form } from 'react-bootstrap'
import {
  readAppointments,
  readUsers,
  STATES,
  changeAppointment,
} from '../../lib/admin'
import { PageHeading, DataTable, Status, Confirm } from './shared'
import { useAdminData } from '../../lib/useAdminData'
export default function Appointments() {
  const appointments = useAdminData(readAppointments)
  const users = useAdminData(readUsers)
  const [query, setQuery] = useState('')
  const [state, setState] = useState('Todos')
  const [action, setAction] = useState(null)
  const [notice, setNotice] = useState(null)
  const patientName = (item) =>
    item.pacienteNombre ||
    users.find((user) => user.correo === item.pacienteCorreo)?.nombre ||
    'Paciente'
  const filtered = [...appointments]
    .reverse()
    .filter(
      (item) =>
        `${patientName(item)} ${item.pacienteCorreo}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()) &&
        (state === 'Todos' || item.estado === state),
    )
  const confirm = () => {
    try {
      changeAppointment(action.uid, action.state)
      setNotice({ type: 'success', text: 'Estado de la cita actualizado.' })
    } catch (error) {
      setNotice({ type: 'danger', text: error.message })
    }
    setAction(null)
  }
  return (
    <>
      <PageHeading
        title="Gestor de Citas"
        description="Administra todas las citas agendadas por los pacientes, actualiza sus estados o aplica filtros para buscar atenciones específicas."
      />
      {notice && (
        <Alert variant={notice.type} role="status">
          {notice.text}
        </Alert>
      )}
      <Form
        className="admin-filters"
        onSubmit={(event) => event.preventDefault()}
      >
        <Form.Group controlId="appointment-search">
          <Form.Label>Buscar paciente</Form.Label>
          <Form.Control
            placeholder="Buscar por nombre o correo..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="appointment-state">
          <Form.Label>Estado</Form.Label>
          <Form.Select
            value={state}
            onChange={(event) => setState(event.target.value)}
          >
            <option value="Todos">Todos los estados</option>
            {STATES.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </Form.Select>
        </Form.Group>
        <Button type="submit" variant="success">
          Filtrar
        </Button>
        <Button
          variant="outline-light"
          onClick={() => {
            setQuery('')
            setState('Todos')
          }}
        >
          Limpiar filtros
        </Button>
      </Form>
      <p className="admin-help">
        {filtered.length} de {appointments.length} citas
      </p>
      <DataTable
        headers={['Fecha y Hora', 'Paciente', 'Servicio', 'Estado', 'Acciones']}
        empty={
          !filtered.length &&
          (appointments.length
            ? 'No hay citas que coincidan con los filtros.'
            : 'No hay citas agendadas en el sistema.')
        }
      >
        {filtered.map((item) => (
          <tr key={item.uid}>
            <td>
              <strong>{item.fecha || 'Sin fecha'}</strong>
              <small>{item.hora || 'Por coordinar'}</small>
            </td>
            <td>
              <strong>{patientName(item)}</strong>
              <small>{item.pacienteCorreo}</small>
            </td>
            <td>
              {item.servicioNombre}
              <small>{item.doctor}</small>
              {item.motivo && <small>Motivo: {item.motivo}</small>}
            </td>
            <td>
              <Status value={item.estado} />
            </td>
            <td>
              <Form.Select
                className="admin-state-select"
                aria-label={`Cambiar estado de cita de ${patientName(item)} del ${item.fecha || 'día por coordinar'}`}
                value=""
                onChange={(event) =>
                  setAction({
                    uid: item.uid,
                    state: event.target.value,
                    title: 'Cambiar estado de cita',
                    message: `¿Seguro que deseas cambiar la cita de ${patientName(item)} a ${event.target.value}?`,
                    label: 'Confirmar cambio',
                  })
                }
              >
                <option value="" disabled>
                  Cambiar estado...
                </option>
                {STATES.map((value) => (
                  <option key={value} disabled={value === item.estado}>
                    {value}
                  </option>
                ))}
              </Form.Select>
            </td>
          </tr>
        ))}
      </DataTable>
      <Confirm
        action={action}
        onHide={() => setAction(null)}
        onConfirm={confirm}
      />
    </>
  )
}
