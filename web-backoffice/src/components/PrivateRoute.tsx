import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function PrivateRoute({ children }: { children: JSX.Element }) {
  const { token } = useAuth()
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return children
}
