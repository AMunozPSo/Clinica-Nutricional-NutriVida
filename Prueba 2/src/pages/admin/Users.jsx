import { useState } from 'react'
import UserFields from '../../components/UserFields'
import { emptyUser } from '../../lib/userDefaults'
import { Alert, Button, Form, Modal, Table } from 'react-bootstrap'
import {
  BASE_ADMINS,
  readUsers,
  readAppointments,
  role,
  createUser,
  changeUser,
  editUser,
} from '../../lib/admin'
import { arrayStored } from '../../lib/admin'
import { money } from '../../lib/admin'
import { PageHeading, DataTable, Confirm } from './shared'
import { useAdminData } from '../../lib/useAdminData'
const roleLabels = {
  superadmin: 'Super Admin',
  admin: 'Admin',
  medico: 'Médico Especialista',
  paciente: 'Paciente',
  vendedor: 'Vendedor',
}
const initial = emptyUser
export default function Users({ session }) {
  const users = useAdminData(readUsers)
  const appointments = useAdminData(readAppointments)
  const [open, setOpen] = useState(false)
  const [values, setValues] = useState(initial)
  const [notice, setNotice] = useState(null)
  const [action, setAction] = useState(null)
  const [editing, setEditing] = useState(null)
  const [history, setHistory] = useState(null)
  const superAdmin = BASE_ADMINS.includes(session.correo)
  const submit = (event) => {
    event.preventDefault()
    try {
      createUser(values)
      setOpen(false)
      setValues(initial)
      setNotice({ type: 'success', text: 'Usuario registrado correctamente.' })
    } catch (error) {
      setNotice({ type: 'danger', text: error.message })
    }
  }
  const ask = (user, kind) =>
    setAction({
      correo: user.correo,
      kind,
      title:
        kind === 'delete'
          ? 'Eliminar usuario'
          : kind === 'promote'
            ? 'Dar privilegios de administrador'
            : 'Revocar privilegios de administrador',
      message: `¿Confirmas esta acción para ${user.correo}?`,
      danger: kind === 'delete',
      label:
        kind === 'delete' ? 'Confirmar eliminación' : 'Confirmar cambio de rol',
    })
  const confirm = () => {
    try {
      changeUser(action.correo, action.kind)
      setNotice({
        type: 'success',
        text:
          action.kind === 'delete'
            ? 'Usuario eliminado.'
            : 'Rol actualizado correctamente.',
      })
    } catch (error) {
      setNotice({ type: 'danger', text: error.message })
    }
    setAction(null)
  }
  return (
    <>
      <PageHeading
        title="Gestión de Usuarios"
        description="Administra los pacientes registrados, revisa su consumo de servicios y asigna roles de administrador."
      >
        <Button
          variant="success"
          onClick={() => {
            setOpen(!open)
            setNotice(null)
            setValues(initial)
          }}
        >
          + Nuevo Paciente
        </Button>
      </PageHeading>
      {notice && (
        <Alert variant={notice.type} role="status">
          {notice.text}
        </Alert>
      )}
      {open && (
        <section className="admin-section">
          <h2>Registrar Paciente Manualmente</h2>
          <Form noValidate onSubmit={submit}>
            <UserFields
              values={values}
              onChange={setValues}
              canAssignAdmin={superAdmin}
            />
            <p className="admin-help">
              RUN sin puntos ni guion. Los roles se asignan desde
              administración.
            </p>
            <div className="admin-form-actions">
              <Button variant="outline-light" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button variant="success" type="submit">
                Guardar Paciente
              </Button>
            </div>
          </Form>
        </section>
      )}
      <DataTable
        headers={[
          'Nombre Completo',
          'Correo Electrónico',
          'Rol',
          'Servicios Tomados',
          'Acciones',
        ]}
        empty={!users.length && 'No hay usuarios registrados.'}
      >
        {users.map((user) => {
          const userRole = role(user)
          const locked =
            userRole === 'superadmin' ||
            user.correo === session.correo ||
            (userRole === 'admin' && !superAdmin)
          return (
            <tr key={user.correo}>
              <td>
                <strong>{user.nombre || 'Sin nombre'}</strong>
                <small>{user.run || 'Sin RUN'}</small>
              </td>
              <td>{user.correo}</td>
              <td>
                <span className={`admin-role role-${userRole}`}>
                  {roleLabels[userRole]}
                </span>
              </td>
              <td>
                {
                  appointments.filter(
                    (item) => item.pacienteCorreo === user.correo,
                  ).length
                }
              </td>
              <td>
                {locked ? (
                  <span className="admin-help">Cuenta protegida</span>
                ) : (
                  <div className="admin-actions">
                    <Button
                      size="sm"
                      variant="outline-light"
                      aria-label={`Editar a ${user.nombre || user.correo}`}
                      onClick={() =>
                        setEditing({
                          ...user,
                          telefono: user.telefono || '',
                          direccion: user.direccion || '',
                          run: user.run || '',
                        })
                      }
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-light"
                      onClick={() => setHistory(user)}
                    >
                      Ver historial
                    </Button>
                    {superAdmin && (
                      <Button
                        size="sm"
                        variant="outline-light"
                        onClick={() =>
                          ask(user, userRole === 'admin' ? 'demote' : 'promote')
                        }
                      >
                        {userRole === 'admin' ? 'Quitar Admin' : 'Hacer Admin'}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline-danger"
                      aria-label={`Eliminar a ${user.nombre || user.correo}`}
                      onClick={() => ask(user, 'delete')}
                    >
                      Eliminar
                    </Button>
                  </div>
                )}
              </td>
            </tr>
          )
        })}
      </DataTable>
      <Modal
        show={!!editing}
        onHide={() => setEditing(null)}
        centered
        aria-labelledby="edit-user-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="edit-user-title">Editar usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editing && (
            <Form
              onSubmit={(event) => {
                event.preventDefault()
                try {
                  editUser(editing.correo, editing)
                  setEditing(null)
                  setNotice({ type: 'success', text: 'Usuario actualizado.' })
                } catch (error) {
                  setNotice({ type: 'danger', text: error.message })
                  setEditing(null)
                }
              }}
            >
              <p>{editing.correo}</p>
              <UserFields
                values={editing}
                onChange={setEditing}
                prefix="edit-user"
                editing
              />
              <Button variant="success" type="submit">
                Guardar usuario
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
      <Modal
        show={!!history}
        onHide={() => setHistory(null)}
        size="lg"
        aria-labelledby="user-history-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="user-history-title">
            Historial de {history?.nombre}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h3 className="h5">Citas</h3>
          <Table responsive>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Servicio</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {appointments
                .filter((row) => row.pacienteCorreo === history?.correo)
                .map((row) => (
                  <tr key={row.uid}>
                    <td>{row.fecha}</td>
                    <td>{row.servicioNombre}</td>
                    <td>{row.estado}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
          <h3 className="h5">Compras</h3>
          <Table responsive>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {arrayStored('nutrivida_ordenes')
                .filter((row) => row.correo === history?.correo)
                .map((row) => (
                  <tr key={row.id}>
                    <td>{new Date(row.fecha).toLocaleDateString('es-CL')}</td>
                    <td>{money(row.total)}</td>
                    <td>{row.estado}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
      <Confirm
        action={action}
        onHide={() => setAction(null)}
        onConfirm={confirm}
      />
    </>
  )
}
