import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthPage } from '../pages/Auth/AuthPage'
import { HomePage } from '../pages/Home/HomePage'
import { OnboardingPage } from '../pages/Onboarding/OnboardingPage'
import { OnboardingGuard } from './OnboardingGuard'
import { ProtectedRoute } from './ProtectedRoute'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="/auth" element={<AuthPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomePage />} />
        </Route>

        <Route element={<OnboardingGuard />}>
          <Route path="/onboarding" element={<OnboardingPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </BrowserRouter>
  )
}