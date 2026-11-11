import { useEffect, useState } from 'react'
import { readSession } from './storage'

export function useSession() {
  const [session, setSession] = useState(readSession)
  useEffect(() => {
    const refresh = () => setSession(readSession())
    window.addEventListener('storage', refresh)
    window.addEventListener('nutrivida-session', refresh)
    return () => {
      window.removeEventListener('storage', refresh)
      window.removeEventListener('nutrivida-session', refresh)
    }
  }, [])
  return session
}
