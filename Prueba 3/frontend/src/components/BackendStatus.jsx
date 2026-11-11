import { useCallback, useEffect, useState } from 'react'
import { Alert, Button, Container, Spinner } from 'react-bootstrap'
import { initializeApi, connectionNotice } from '../lib/api'

export function BackendStatus({ children }) {
  const [ready, setReady] = useState(false)
  const [failure, setFailure] = useState('')
  const [message, setMessage] = useState('')
  const initialize = useCallback(async () => {
    setFailure('')
    try { await initializeApi(); setReady(true) }
    catch (error) { setFailure(error.message) }
  }, [])
  useEffect(() => {
    initialize()
    const changed = () => setMessage(connectionNotice())
    window.addEventListener('nutrivida-data', changed)
    return () => window.removeEventListener('nutrivida-data', changed)
  }, [initialize])
  if (!ready) return <Container className="py-5 text-center">
    <h1 className="h3">Clínica NutriVida</h1>
    {failure ? <><Alert variant="danger">{failure}</Alert><Button onClick={initialize}>Reintentar</Button></> : <><Spinner animation="border" /><p className="mt-3">Cargando la clínica…</p></>}
  </Container>
  return <>{message && <Alert variant="warning" role="status" className="mb-0">{message}</Alert>}{children}</>
}
