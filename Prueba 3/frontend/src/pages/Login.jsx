import { useState } from 'react'
import { Container, Form, Button, Card, Alert } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { adoptGuestCart } from '../lib/commerce'
import { loginSession } from '../lib/storage'
import { notice } from '../lib/api'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const navigate = useNavigate()
  const { state } = useLocation()

  const manejarLogin = async event => {
    event.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')
    try {
      const session = await loginSession(email.trim().toLowerCase(), password)
      try { adoptGuestCart() } catch { notice('Sesión iniciada. No se pudo recuperar el carrito de este navegador.') }
      const returnTo = typeof state?.returnTo === 'string' && /^\/agendar(?:\?|$)/.test(state.returnTo) ? state.returnTo : null
      navigate(returnTo || (session.esAdmin ? '/admin' : session.rol === 'medico' ? '/doctor' : '/'))
    } catch (failure) { setError(failure.message) }
    finally { setBusy(false) }
  }

  return (
    <Container className="mt-5 d-flex justify-content-center">
      <Card className="shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <Card.Body>
          <h2 className="text-center text-success mb-4">Iniciar Sesión</h2>

          {/* Si hay un error, mostramos esta alerta roja */}
          {error && <Alert variant="danger">{error}</Alert>}
          {state?.registroExitoso && (
            <Alert variant="success" role="status">
              ¡Registro exitoso! Ya puedes iniciar sesión con tu cuenta.
            </Alert>
          )}

          <Form onSubmit={manejarLogin}>
            <Form.Group className="mb-3" controlId="emailLogin">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                autoComplete="username"
                placeholder="Ingresa tu correo"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="passwordLogin">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                autoComplete="current-password"
                placeholder="Ingresa tu contraseña"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="success" type="submit" disabled={busy} className="w-100 fw-bold">
              {busy ? 'Ingresando…' : 'Entrar'}
            </Button>
          </Form>
          <p className="text-center mt-4 mb-0">
            ¿No tienes una cuenta?{' '}
            <Link
              to="/registro"
              state={{ returnTo: state?.returnTo }}
              className="fw-semibold"
            >
              Registrarse
            </Link>
          </p>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Login
