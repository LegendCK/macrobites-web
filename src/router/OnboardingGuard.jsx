import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export function OnboardingGuard() {
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  if (user?.isOnboarded) {
    return <Navigate to="/home" replace />
  }

  return <Outlet />
}