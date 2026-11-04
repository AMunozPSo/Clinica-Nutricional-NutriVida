import { Link } from 'react-router-dom'
import {
  arrayStored,
  readUsers,
  readAppointments,
  serviceList,
  statistics,
  today,
} from '../../lib/admin'
import { PageHeading, Metrics, DataTable, Status } from './shared'
import { useAdminData } from '../../lib/useAdminData'
const readMessages = () => arrayStored('nutrivida_mensajes')
export default function Overview({ session }) {
  const users = useAdminData(readUsers)
  const appointments = useAdminData(readAppointments)
  const services = useAdminData(serviceList)
  const messages = useAdminData(readMessages)
  const stats = statistics(users, appointments, services)
  const upcoming = appointments
    .filter(
      (item) =>
        item.fecha >= today() &&
        !['Cancelada', 'Completada'].includes(item.estado),
    )
    .sort((a, b) =>
      `${a.fecha} ${a.hora}`.localeCompare(`${b.fecha} ${b.hora}`),
    )
    .slice(0, 5)
  return (
    <>
      <PageHeading
        title={`Hola ${session.nombre}`}
        description="Aquí tienes el resumen de actividad de la clínica del día de hoy."
      />
      <Metrics
        items={[
          ['Citas Programadas (Hoy)', stats.today],
          ['Total Pacientes Registrados', stats.patients],
          ['Planes Alimenticios Activos', stats.plans],
        ]}
      />
      <section className="admin-section">
        <div className="admin-section-heading">
          <h2>Próximas Citas (Generales)</h2>
          <Link to="/admin/citas">Ver todas las citas →</Link>
        </div>
        <DataTable
          headers={['Fecha y Hora', 'Paciente', 'Servicio', 'Estado']}
          empty={!upcoming.length && 'No hay citas programadas próximamente.'}
        >
          {upcoming.map((item) => (
            <tr key={item.uid}>
              <td>
                {item.fecha}
                <small>{item.hora || 'Por coordinar'}</small>
              </td>
              <td>
                {item.pacienteNombre ||
                  users.find((user) => user.correo === item.pacienteCorreo)
                    ?.nombre ||
                  item.pacienteCorreo ||
                  'Paciente'}
              </td>
              <td>{item.servicioNombre}</td>
              <td>
                <Status value={item.estado} />
              </td>
            </tr>
          ))}
        </DataTable>
      </section>
      <section className="admin-section">
        <div className="admin-section-heading">
          <h2>Bandeja de Mensajes (Contacto)</h2>
          <span>{messages.length} mensajes</span>
        </div>
        {!messages.length ? (
          <p className="admin-empty">No hay mensajes nuevos en la bandeja.</p>
        ) : (
          <div className="admin-messages">
            {[...messages].reverse().map((msg, index) => (
              <article className="admin-message" key={msg.id || index}>
                <div>
                  <h3>{msg.nombre}</h3>
                  <time>{msg.fecha}</time>
                </div>
                <a href={`mailto:${msg.correo}`}>{msg.correo}</a>
                <p>{msg.comentario}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
