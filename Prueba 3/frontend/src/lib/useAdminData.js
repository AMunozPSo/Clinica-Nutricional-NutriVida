import { useEffect, useState } from 'react'

export function useAdminData(reader) {
  const [data, setData] = useState(reader)
  useEffect(() => {
    const refresh = () => setData(reader())
    window.addEventListener('storage', refresh)
    window.addEventListener('nutrivida-data', refresh)
    window.addEventListener('nutrivida-session', refresh)
    return () => {
      window.removeEventListener('storage', refresh)
      window.removeEventListener('nutrivida-data', refresh)
      window.removeEventListener('nutrivida-session', refresh)
    }
  }, [reader])
  return data
}
