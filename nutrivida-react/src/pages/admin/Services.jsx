import { useState } from 'react'
import { Alert, Button, Form } from 'react-bootstrap'
import { serviceList, saveServices, amount, money } from '../../lib/admin'
import { readCategories } from '../../lib/commerce'
import { PageHeading, DataTable, Confirm } from './shared'
import { useAdminData } from '../../lib/useAdminData'
const initial = {
  titulo: '',
  doctor: '',
  categoria: 'evaluaciones',
  precio: '',
  descripcion: '',
  imagen: '/consulta.jpg',
  modalidad: 'Presencial',
  duracion: 45,
  descuento: 0,
}
export default function Services() {
  const categories = useAdminData(readCategories)
  const categoryNames = Object.fromEntries(
    categories.map((item) => [item.id, item.nombre]),
  )
  const services = useAdminData(serviceList)
  const [form, setForm] = useState(null)
  const [notice, setNotice] = useState(null)
  const [action, setAction] = useState(null)
  const update = (key, value) => setForm({ ...form, [key]: value })
  const submit = (event) => {
    event.preventDefault()
    if (
      !form.titulo.trim() ||
      !form.doctor.trim() ||
      !form.descripcion.trim() ||
      !categories.some((item) => item.id === form.categoria) ||
      Number(form.descuento || 0) < 0 ||
      Number(form.descuento || 0) > 90 ||
      !Number.isInteger(Number(form.precio)) ||
      Number(form.precio) < 0 ||
      !Number.isInteger(Number(form.duracion)) ||
      Number(form.duracion) < 1
    ) {
      setNotice({
        type: 'danger',
        text: 'Completa los campos, ingresa un precio válido y una duración mayor que cero.',
      })
      return
    }
    const image = form.imagen.trim() || '/consulta.jpg'
    if (!/^(https?:\/\/|\/(?!\/))/i.test(image)) {
      setNotice({
        type: 'danger',
        text: 'La imagen debe ser una URL http(s) o una ruta local que empiece con /.',
      })
      return
    }
    const saved = {
      ...form,
      id:
        form.id ??
        Math.max(0, ...services.map((item) => Number(item.id) || 0)) + 1,
      titulo: form.titulo.trim(),
      nombre: form.titulo.trim(),
      doctor: form.doctor.trim(),
      descripcion: form.descripcion.trim(),
      imagen: image,
      precio: Number(form.precio).toLocaleString('es-CL'),
      duracion: Number(form.duracion),
      descuento: Number(form.descuento || 0),
    }
    try {
      saveServices(
        form.id != null
          ? services.map((item) => (item.id === form.id ? saved : item))
          : [...services, saved],
      )
      setForm(null)
      setNotice({ type: 'success', text: 'Servicio guardado correctamente.' })
    } catch {
      setNotice({
        type: 'danger',
        text: 'No se pudo guardar. Revisa el espacio disponible del navegador.',
      })
    }
  }
  const remove = () => {
    try {
      saveServices(services.filter((item) => item.id !== action.id))
      setNotice({ type: 'success', text: 'Servicio eliminado correctamente.' })
    } catch {
      setNotice({ type: 'danger', text: 'No se pudo eliminar el servicio.' })
    }
    setAction(null)
  }
  return (
    <>
      <PageHeading
        title="Catálogo de Servicios"
        description="Administra los planes nutricionales, asigna los especialistas a cargo y actualiza los valores."
      >
        <Button
          variant="success"
          onClick={() => {
            setForm({ ...initial, categoria: categories[0]?.id || '' })
            setNotice(null)
          }}
        >
          + Nuevo Servicio
        </Button>
      </PageHeading>
      {notice && (
        <Alert variant={notice.type} role="status">
          {notice.text}
        </Alert>
      )}
      {form && (
        <section className="admin-section">
          <h2>
            {form.id != null ? 'Editar Servicio' : 'Agregar Nuevo Servicio'}
          </h2>
          <Form onSubmit={submit}>
            <div className="admin-form-grid">
              {[
                ['titulo', 'Nombre del Servicio', 'text'],
                ['doctor', 'Especialista a Cargo', 'text'],
                ['precio', 'Precio (CLP)', 'number'],
                ['duracion', 'Duración (minutos)', 'number'],
                ['descuento', 'Descuento (%)', 'number'],
              ].map(([key, label, type]) => (
                <Form.Group controlId={`service-${key}`} key={key}>
                  <Form.Label>{label}</Form.Label>
                  <Form.Control
                    required
                    type={type}
                    min={
                      key === 'duracion' ? 1 : key === 'precio' ? 0 : undefined
                    }
                    step={type === 'number' ? 1 : undefined}
                    maxLength={type === 'text' ? 100 : undefined}
                    value={form[key] ?? 0}
                    onChange={(event) => update(key, event.target.value)}
                  />
                </Form.Group>
              ))}
              <Form.Group controlId="service-category">
                <Form.Label>Categoría</Form.Label>
                <Form.Select
                  required
                  value={form.categoria}
                  onChange={(event) => update('categoria', event.target.value)}
                >
                  {!categoryNames[form.categoria] && (
                    <option value={form.categoria}>{form.categoria}</option>
                  )}
                  {Object.entries(categoryNames).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group controlId="service-mode">
                <Form.Label>Modalidad</Form.Label>
                <Form.Select
                  value={form.modalidad}
                  onChange={(event) => update('modalidad', event.target.value)}
                >
                  <option>Presencial</option>
                  <option>Online</option>
                </Form.Select>
              </Form.Group>
              <Form.Group controlId="service-image">
                <Form.Label>Imagen (URL o ruta local)</Form.Label>
                <Form.Control
                  value={form.imagen}
                  onChange={(event) => update('imagen', event.target.value)}
                  placeholder="/consulta.jpg"
                />
              </Form.Group>
              <Form.Group
                className="admin-wide"
                controlId="service-description"
              >
                <Form.Label>Descripción Breve</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  required
                  maxLength={500}
                  value={form.descripcion}
                  onChange={(event) =>
                    update('descripcion', event.target.value)
                  }
                />
              </Form.Group>
            </div>
            <div className="admin-form-actions">
              <Button variant="outline-light" onClick={() => setForm(null)}>
                Cancelar
              </Button>
              <Button variant="success" type="submit">
                {form.id != null ? 'Actualizar Servicio' : 'Guardar Servicio'}
              </Button>
            </div>
          </Form>
        </section>
      )}
      <DataTable
        headers={[
          'Servicio',
          'Especialista',
          'Categoría',
          'Descripción',
          'Modalidad / Duración',
          'Precio',
          'Acciones',
        ]}
        empty={!services.length && 'No hay servicios en el catálogo.'}
      >
        {services.map((item) => (
          <tr key={item.id}>
            <td>
              <strong>{item.titulo}</strong>
            </td>
            <td>{item.doctor || 'Sin asignar'}</td>
            <td>{categoryNames[item.categoria] || item.categoria}</td>
            <td className="admin-description">{item.descripcion}</td>
            <td>
              {item.modalidad}
              <small>{item.duracion} min</small>
            </td>
            <td className="admin-price">{money(item.precio)}</td>
            <td>
              <div className="admin-actions">
                <Button
                  size="sm"
                  variant="outline-light"
                  aria-label={`Editar ${item.titulo}`}
                  onClick={() => {
                    setForm({ ...item, precio: amount(item.precio) })
                    setNotice(null)
                  }}
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="outline-danger"
                  aria-label={`Eliminar ${item.titulo}`}
                  onClick={() =>
                    setAction({
                      id: item.id,
                      title: 'Eliminar servicio',
                      message: `¿Quieres eliminar «${item.titulo}» del catálogo?`,
                      danger: true,
                      label: 'Confirmar eliminación',
                    })
                  }
                >
                  Eliminar
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>
      <Confirm
        action={action}
        onHide={() => setAction(null)}
        onConfirm={remove}
      />
    </>
  )
}
