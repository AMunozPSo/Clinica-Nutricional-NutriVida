import { useState } from 'react'
import { Alert, Button, Form } from 'react-bootstrap'
import { serviceList, saveService, deleteService, money } from '../../lib/admin'
import { readCategories } from '../../lib/commerce'
import { readProfessionals } from '../../lib/api'
import { useAdminData } from '../../lib/useAdminData'
import { PageHeading, DataTable, Confirm } from './shared'

const initial = { titulo: '', categoria: '', profesionalId: '', descripcion: '', precio: '', descuento: 0, modalidad: 'Presencial', duracion: 45, imagen: '/consulta.jpg', activo: true }
export default function Services() {
  const services = useAdminData(serviceList)
  const categories = useAdminData(readCategories)
  const professionals = useAdminData(readProfessionals)
  const [form, setForm] = useState(null)
  const [notice, setNotice] = useState(null)
  const [action, setAction] = useState(null)
  const [busy, setBusy] = useState(false)
  const update = (key, value) => setForm(previous => ({ ...previous, [key]: value }))
  const submit = async event => {
    event.preventDefault()
    if (busy) return
    if (!/^(https?:\/\/|\/(?!\/))/i.test(form.imagen)) { setNotice({ type: 'danger', text: 'Usa una imagen http(s) o una ruta local que empiece con /.' }); return }
    setBusy(true)
    try { await saveService(form); setForm(null); setNotice({ type: 'success', text: 'Servicio guardado en la clínica.' }) }
    catch (error) { setNotice({ type: 'danger', text: error.message }) }
    finally { setBusy(false) }
  }
  const remove = async () => {
    setBusy(true)
    try { await deleteService(action.id); setNotice({ type: 'success', text: 'Servicio desactivado. Se conserva el historial.' }) }
    catch (error) { setNotice({ type: 'danger', text: error.message }) }
    finally { setBusy(false); setAction(null) }
  }
  return <>
    <PageHeading title="Catálogo de servicios" description="Administra los servicios, profesionales, precios y ofertas.">
      <Button variant="success" onClick={() => { setForm({ ...initial, categoria: categories[0]?.id || '' }); setNotice(null) }}>+ Nuevo servicio</Button>
    </PageHeading>
    {notice && <Alert variant={notice.type} role="status">{notice.text}</Alert>}
    {form && <section className="admin-section">
      <h2>{form.id ? 'Editar servicio' : 'Agregar servicio'}</h2>
      <Form onSubmit={submit}><div className="admin-form-grid">
        {[['titulo', 'Nombre del servicio', 'text'], ['precio', 'Precio (CLP)', 'number'], ['duracion', 'Duración (minutos)', 'number'], ['descuento', 'Descuento (%)', 'number'], ['imagen', 'Imagen', 'text']].map(([key, label, type]) => <Form.Group key={key} controlId={`service-${key}`}>
          <Form.Label>{label}</Form.Label><Form.Control required type={type} value={form[key]} min={key === 'duracion' ? 1 : 0} max={key === 'descuento' ? 90 : key === 'duracion' ? 600 : undefined} step={key === 'descuento' ? '0.01' : 1} maxLength={key === 'titulo' ? 150 : 1000} onChange={event => update(key, event.target.value)} />
        </Form.Group>)}
        <Form.Group controlId="service-category"><Form.Label>Categoría</Form.Label><Form.Select required value={form.categoria} onChange={event => update('categoria', event.target.value)}><option value="">Selecciona una categoría</option>{categories.map(row => <option key={row.id} value={row.id}>{row.nombre}</option>)}</Form.Select></Form.Group>
        <Form.Group controlId="service-professional"><Form.Label>Profesional a cargo</Form.Label><Form.Select value={form.profesionalId || ''} onChange={event => update('profesionalId', event.target.value)}><option value="">Por asignar</option>{professionals.map(row => <option key={row.id} value={row.id}>{row.nombre}</option>)}</Form.Select></Form.Group>
        <Form.Group controlId="service-mode"><Form.Label>Modalidad</Form.Label><Form.Select value={form.modalidad} onChange={event => update('modalidad', event.target.value)}><option>Presencial</option><option>Online</option></Form.Select></Form.Group>
        <Form.Group controlId="service-description"><Form.Label>Descripción</Form.Label><Form.Control required as="textarea" rows={3} maxLength={2000} value={form.descripcion} onChange={event => update('descripcion', event.target.value)} /></Form.Group>
        <Form.Check id="service-active" label="Disponible en el catálogo" checked={form.activo} onChange={event => update('activo', event.target.checked)} />
      </div><div className="admin-form-actions"><Button variant="outline-light" onClick={() => setForm(null)}>Cancelar</Button><Button type="submit" variant="success" disabled={busy}>{busy ? 'Guardando…' : 'Guardar servicio'}</Button></div></Form>
    </section>}
    <DataTable headers={['Servicio', 'Profesional', 'Categoría', 'Precio', 'Oferta', 'Estado', 'Acciones']} empty={!services.length && 'No hay servicios registrados.'}>
      {services.map(row => <tr key={row.id}><td>{row.titulo}<small className="d-block">{row.modalidad} · {row.duracion} min</small></td><td>{row.doctor || 'Por asignar'}</td><td>{categories.find(c => c.id === row.categoria)?.nombre || 'Sin categoría'}</td><td>{money(row.precio)}</td><td>{row.descuento}%</td><td>{row.activo ? 'Activo' : 'Inactivo'}</td><td><div className="admin-actions"><Button size="sm" variant="outline-light" onClick={() => { setForm({ ...row }); setNotice(null) }}>Editar</Button>{row.activo && <Button size="sm" variant="outline-danger" onClick={() => setAction(row)}>Desactivar</Button>}</div></td></tr>)}
    </DataTable>
    <Confirm action={action && { ...action, title: 'Desactivar servicio', message: `¿Desactivar ${action.titulo}? Las citas y compras anteriores se conservarán.`, label: 'Confirmar desactivación', danger: true }} onHide={() => setAction(null)} onConfirm={remove} />
  </>
}
