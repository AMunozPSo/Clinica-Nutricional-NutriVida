import { useState } from 'react'
import { Alert, Button, Form, Modal, Table } from 'react-bootstrap'
import { readUsers, readAppointments, createUser, changeUser, editUser, money } from '../../lib/admin'
import { visibleOrders } from '../../lib/commerce'
import { LOCATIONS } from '../../lib/registration'
import { useAdminData } from '../../lib/useAdminData'
import { PageHeading, DataTable, Confirm } from './shared'

const initial = { nombres: '', apellidos: '', run: '', correo: '', password: '', telefono: '', direccion: '', region: '', comuna: '', rol: 'paciente' }
const labels = { paciente: 'Paciente', medico: 'Nutricionista', admin: 'Administrador' }
export default function Users({ session }) {
  const users = useAdminData(readUsers)
  const appointments = useAdminData(readAppointments)
  const orders = useAdminData(visibleOrders)
  const [form, setForm] = useState(null)
  const [notice, setNotice] = useState(null)
  const [action, setAction] = useState(null)
  const [history, setHistory] = useState(null)
  const [busy, setBusy] = useState(false)
  const update = (key, value) => setForm(previous => ({ ...previous, [key]: value, ...(key === 'region' ? { comuna: '' } : {}) }))
  const submit = async event => {
    event.preventDefault()
    if (busy) return
    setBusy(true)
    try {
      if (form.id) await editUser(form.correo, form)
      else await createUser(form)
      setForm(null)
      setNotice({ type: 'success', text: 'Usuario guardado correctamente.' })
    } catch (error) { setNotice({ type: 'danger', text: error.message }) }
    finally { setBusy(false) }
  }
  const ask = (user, kind) => setAction({ correo: user.correo, kind, title: kind === 'delete' ? 'Desactivar usuario' : 'Cambiar permisos', message: `¿Confirmas esta acción para ${user.nombre}?`, danger: kind === 'delete' })
  const confirm = async () => {
    if (busy) return
    setBusy(true)
    try { await changeUser(action.correo, action.kind); setNotice({ type: 'success', text: 'Permisos actualizados. Las sesiones anteriores se cerraron.' }) }
    catch (error) { setNotice({ type: 'danger', text: error.message }) }
    finally { setBusy(false); setAction(null) }
  }
  return <>
    <PageHeading title="Gestión de usuarios" description="Administra perfiles, revisa su historial y asigna los permisos de acceso."><Button variant="success" onClick={() => { setForm({ ...initial }); setNotice(null) }}>+ Nuevo usuario</Button></PageHeading>
    {notice && <Alert variant={notice.type} role="status">{notice.text}</Alert>}
    {form && <section className="admin-section"><h2>{form.id ? 'Editar datos del usuario' : 'Registrar usuario'}</h2><Form onSubmit={submit}><div className="admin-form-grid">
      {[
        ['nombres', 'Nombres', 'text'], ['apellidos', 'Apellidos', 'text'], ['run', 'RUN', 'text'], ['correo', 'Correo electrónico', 'email'],
        ...(!form.id ? [['password', 'Contraseña inicial', 'password']] : []),
        ['telefono', 'Teléfono', 'tel'], ['direccion', 'Dirección', 'text'],
      ].map(([key, label, type]) => <Form.Group key={key} controlId={`user-${key}`}><Form.Label>{label}</Form.Label><Form.Control required type={type} readOnly={!!form.id && ['correo', 'run'].includes(key)} value={form[key] || ''} minLength={key === 'password' ? 8 : undefined} maxLength={key === 'password' ? 72 : key === 'telefono' ? 9 : key === 'direccion' ? 250 : key === 'correo' ? 254 : 100} onChange={event => update(key, event.target.value)} /></Form.Group>)}
      {[['region', 'Región', Object.keys(LOCATIONS)], ['comuna', 'Comuna', LOCATIONS[form.region] || []]].map(([key, label, options]) => <Form.Group key={key} controlId={`user-${key}`}><Form.Label>{label}</Form.Label><Form.Select required value={form[key]} onChange={event => update(key, event.target.value)}><option value="">Selecciona una {label.toLowerCase()}</option>{options.map(value => <option key={value}>{value}</option>)}</Form.Select></Form.Group>)}
      {!form.id && <Form.Group controlId="user-role"><Form.Label>Rol</Form.Label><Form.Select value={form.rol} onChange={event => update('rol', event.target.value)}>{Object.entries(labels).map(([key,label]) => <option key={key} value={key}>{label}</option>)}</Form.Select></Form.Group>}
    </div><p className="admin-help">El rol profesional lo autoriza un administrador; el dominio del correo no otorga permisos.</p><div className="admin-form-actions"><Button variant="outline-light" onClick={() => setForm(null)}>Cancelar</Button><Button type="submit" variant="success" disabled={busy}>{busy ? 'Guardando…' : 'Guardar usuario'}</Button></div></Form></section>}
    <DataTable headers={['Nombre', 'Correo', 'Rol', 'Estado', 'Acciones']} empty={!users.length && 'No hay usuarios.'}>
      {users.map(user => <tr key={user.id}><td>{user.nombre}</td><td>{user.correo}</td><td><Form.Select aria-label={`Rol de ${user.nombre}`} size="sm" disabled={user.id === session.id || busy} value={user.rol} onChange={event => ask(user, event.target.value === 'admin' ? 'promote' : event.target.value === 'medico' ? 'medico' : 'demote')}>{Object.entries(labels).map(([key,label]) => <option key={key} value={key}>{label}</option>)}</Form.Select></td><td>{user.activo ? 'Activo' : 'Inactivo'}</td><td><div className="admin-actions"><Button size="sm" variant="outline-light" onClick={() => { setForm({ ...user }); setNotice(null) }}>Editar</Button><Button size="sm" variant="outline-light" onClick={() => setHistory(user)}>Historial</Button>{user.id !== session.id && <Button size="sm" variant={user.activo ? 'outline-danger' : 'outline-success'} onClick={() => ask(user, user.activo ? 'delete' : 'activate')}>{user.activo ? 'Desactivar' : 'Activar'}</Button>}</div></td></tr>)}
    </DataTable>
    <Confirm action={action} onHide={() => setAction(null)} onConfirm={confirm} />
    <Modal show={!!history} onHide={() => setHistory(null)} size="lg" centered><Modal.Header closeButton><Modal.Title>Historial de {history?.nombre}</Modal.Title></Modal.Header><Modal.Body><h3 className="h5">Citas</h3><Table responsive><thead><tr><th>Fecha</th><th>Servicio</th><th>Estado</th></tr></thead><tbody>{appointments.filter(row => row.pacienteId === history?.id).map(row => <tr key={row.id}><td>{row.fecha} {row.hora}</td><td>{row.servicioNombre}</td><td>{row.estado}</td></tr>)}</tbody></Table><h3 className="h5">Compras</h3><Table responsive><thead><tr><th>Fecha</th><th>Total</th><th>Estado</th></tr></thead><tbody>{orders.filter(row => row.usuarioId === history?.id).map(row => <tr key={row.id}><td>{new Date(row.fecha).toLocaleDateString('es-CL')}</td><td>{money(row.total)}</td><td>{row.estado}</td></tr>)}</tbody></Table></Modal.Body></Modal>
  </>
}
