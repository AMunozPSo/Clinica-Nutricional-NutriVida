import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Alert, Button, Container, Form, Table } from 'react-bootstrap'
import { deleteProgress, readProgress, saveProgress } from '../../lib/clinical'
import { today } from '../../lib/admin'
import { useAdminData } from '../../lib/useAdminData'
import { useSession } from '../../lib/useSession'
export default function Progress() {
  const session = useSession()
  const rows = useAdminData(readProgress)
  const [values, setValues] = useState({ fecha: '', peso: '' })
  const [notice, setNotice] = useState('')
  if (!session) return <Navigate to="/login" replace />
  const submit = (event) => {
    event.preventDefault()
    try {
      saveProgress(values)
      setValues({ fecha: '', peso: '' })
      setNotice('Registro guardado.')
    } catch (error) {
      setNotice(error.message)
    }
  }
  return (
    <Container className="py-5">
      <h1 className="h2">Mi progreso</h1>
      <p>
        Registro personal de peso para conversar durante tu atención
        nutricional.
      </p>
      {notice && <Alert role="status">{notice}</Alert>}
      <Form
        noValidate
        onSubmit={submit}
        className="d-flex flex-wrap align-items-end gap-3 mb-4"
      >
        <Form.Group controlId="progress-date">
          <Form.Label>Fecha del registro</Form.Label>
          <Form.Control
            type="date"
            max={today()}
            value={values.fecha}
            onChange={(event) =>
              setValues({ ...values, fecha: event.target.value })
            }
          />
        </Form.Group>
        <Form.Group controlId="progress-weight">
          <Form.Label>Peso en kg</Form.Label>
          <Form.Control
            type="number"
            min={20}
            max={300}
            step="0.1"
            value={values.peso}
            onChange={(event) =>
              setValues({ ...values, peso: event.target.value })
            }
          />
        </Form.Group>
        <Button variant="success" type="submit">
          Guardar registro
        </Button>
      </Form>
      {!rows.length ? (
        <p>Aún no tienes registros.</p>
      ) : (
        <>
          <figure className="bg-white p-4 rounded-4">
            <figcaption className="fw-bold mb-3">Evolución del peso</figcaption>
            {rows.map((row) => (
              <div
                className="d-flex align-items-center gap-2 mb-2"
                key={row.id}
              >
                <span className="small" style={{ minWidth: 95 }}>
                  {row.fecha}
                </span>
                <div
                  className="progress flex-grow-1"
                  role="img"
                  aria-label={`${row.fecha}: ${row.peso} kg`}
                >
                  <div
                    className="progress-bar bg-success"
                    style={{ width: `${row.peso / 3}%` }}
                  />
                </div>
                <span>{row.peso} kg</span>
              </div>
            ))}
          </figure>
          <Table responsive>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Peso</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.fecha}</td>
                  <td>{row.peso} kg</td>
                  <td>
                    <Button
                      variant="outline-danger"
                      onClick={() => {
                        try {
                          deleteProgress(row.id)
                          setNotice('Registro eliminado.')
                        } catch (error) {
                          setNotice(error.message)
                        }
                      }}
                    >
                      Eliminar registro
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </Container>
  )
}
