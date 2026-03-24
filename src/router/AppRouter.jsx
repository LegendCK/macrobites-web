import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthPage } from '../pages/Auth/AuthPage'
import { HomePage } from '../pages/Home/HomePage'
import { MealsPage } from '../pages/Meals/MealsPage'
import { OnboardingPage } from '../pages/Onboarding/OnboardingPage'
import CalendarPage from '../pages/Calendar/CalendarPage'
import { PlaceholderPage } from '../pages/Placeholder/PlaceholderPage'
import { OnboardingGuard } from './OnboardingGuard'
import { ProtectedRoute } from './ProtectedRoute'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage mode="logged-out" />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/plans" element={<PlaceholderPage title="Plans" />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomePage mode="logged-in" />} />
          <Route path="/meals" element={<MealsPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/nutritionist" element={<PlaceholderPage title="Nutritionist" loggedIn />} />
          <Route path="/rewards" element={<PlaceholderPage title="Rewards" loggedIn />} />
        </Route>

        <Route element={<OnboardingGuard />}>
          <Route path="/onboarding" element={<OnboardingPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}