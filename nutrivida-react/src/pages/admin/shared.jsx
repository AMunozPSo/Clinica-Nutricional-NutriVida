import { Modal, Button } from 'react-bootstrap'

export function PageHeading({ title, description, children }) {
  return (
    <header className="admin-page-heading">
      <div>
        <p className="admin-eyebrow">CLÍNICA NUTRIVIDA</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children}
    </header>
  )
}
export function Metrics({ items }) {
  return (
    <div className="admin-metrics">
      {items.map(([label, value, note]) => (
        <article className="admin-metric" key={label}>
          <h2>{label}</h2>
          <p className="admin-number">{value}</p>
          {note && <small>{note}</small>}
        </article>
      ))}
    </div>
  )
}
export function DataTable({ headers, children, empty }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            {headers.map((label) => (
              <th key={label} scope="col">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {empty ? (
            <tr>
              <td colSpan={headers.length} className="admin-empty">
                {empty}
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  )
}
export function Status({ value }) {
  return (
    <span className={`admin-status status-${value.toLowerCase()}`}>
      {value}
    </span>
  )
}
export function Confirm({ action, onHide, onConfirm }) {
  return (
    <Modal
      show={!!action}
      onHide={onHide}
      centered
      aria-labelledby="confirm-title"
    >
      <Modal.Header closeButton>
        <Modal.Title id="confirm-title">{action?.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{action?.message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button
          variant={action?.danger ? 'danger' : 'success'}
          onClick={onConfirm}
        >
          {action?.label || 'Confirmar'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
