import { Navigate, Link } from 'react-router-dom'
import { Alert, Card, Container } from 'react-bootstrap'
import { readPlans } from '../../lib/clinical'
import { useAdminData } from '../../lib/useAdminData'
import { useSession } from '../../lib/useSession'
export default function Plan() {
  const session = useSession()
  const plans = useAdminData(readPlans)
  if (!session) return <Navigate to="/login" replace />
  return (
    <Container className="py-5">
      <h1 className="h2">Mi plan alimenticio</h1>
      {plans.length ? (
        plans.map((plan) => (
          <Card className="p-4 mb-3" key={plan.id}>
            <h2 className="h4">{plan.titulo}</h2>
            <p>
              Profesional: {plan.profesional} · {plan.fecha}
            </p>
            <p style={{ whiteSpace: 'pre-wrap' }}>{plan.contenido}</p>
          </Card>
        ))
      ) : (
        <Alert variant="info">
          Todavía no tienes un plan asignado. Tu profesional puede publicarlo
          después de la consulta.
        </Alert>
      )}
      <Link to="/citas">Ver mis citas</Link>
    </Container>
  )
}
