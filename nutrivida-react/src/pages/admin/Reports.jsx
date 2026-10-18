import {
  readUsers,
  readAppointments,
  serviceList,
  statistics,
  money,
} from '../../lib/admin'
import { visibleOrders } from '../../lib/commerce'
import { PageHeading, Metrics } from './shared'
import { useAdminData } from '../../lib/useAdminData'
export default function Reports() {
  const orders = useAdminData(visibleOrders)
  const users = useAdminData(readUsers)
  const appointments = useAdminData(readAppointments)
  const services = useAdminData(serviceList)
  const stats = statistics(users, appointments, services)
  return (
    <>
      <PageHeading
        title="Reportes y Estadísticas"
        description="Resumen general del rendimiento de la clínica basado en las citas y usuarios registrados."
      />
      <Metrics
        items={[
          ['Ingresos Generados', money(stats.income), 'Solo citas completadas'],
          ['Citas Completadas', stats.completed],
          ['Citas Pendientes', stats.pending],
          ['Pacientes Registrados', stats.patients],
          [
            'Compras pagadas simuladas',
            orders.filter((order) => order.estado === 'Pagada').length,
          ],
          [
            'Total compras simuladas',
            money(
              orders
                .filter((order) => order.estado === 'Pagada')
                .reduce((sum, order) => sum + order.total, 0),
            ),
          ],
        ]}
      />
      <section className="admin-section">
        <h2>Cómo se calculan los reportes</h2>
        <p>
          Los ingresos suman el precio de cada cita completada. Cuando una cita
          no registra su propio precio, se utiliza el valor actual del servicio
          asociado.
        </p>
        <p>
          Las citas canceladas no generan ingresos. El total de pacientes
          excluye las cuentas de administradores y médicos especialistas.
        </p>
      </section>
    </>
  )
}
