import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthPage } from '../pages/Auth/AuthPage'
import { HomePage } from '../pages/Home/HomePage'
import { MealsPage } from '../pages/Meals/MealsPage'
import { OnboardingPage } from '../pages/Onboarding/OnboardingPage'
import CalendarPage from '../pages/Calendar/CalendarPage'
import PlansPage from '../pages/Plans/PlansPage'
import { NutritionistPage } from '../pages/Nutritionist/NutritionistPage'
import { RewardsPage } from '../pages/Rewards/RewardsPage'
import ProfilePage from '../pages/Profile/ProfilePage'
import { TeamMemberDetailPage } from '../pages/TeamMemberDetail/TeamMemberDetailPage'
import { TeamPage } from '../pages/Team/TeamPage'
import { AddMemberPage } from '../pages/AddMember/AddMemberPage'
import { ViewMembersPage } from '../pages/ViewMembers/ViewMembersPage'
import { OnboardingGuard } from './OnboardingGuard'
import { ProtectedRoute } from './ProtectedRoute'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage mode="logged-out" />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/team/add" element={<AddMemberPage />} />
        <Route path="/team/members" element={<ViewMembersPage />} />
        <Route path="/team/members/:memberId" element={<TeamMemberDetailPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/plans" element={<PlansPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomePage mode="logged-in" />} />
          <Route path="/meals" element={<MealsPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/nutritionist" element={<NutritionistPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route element={<OnboardingGuard />}>
          <Route path="/onboarding" element={<OnboardingPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}