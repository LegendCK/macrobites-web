import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button/Button'
import { useAuthStore } from '../../store/authStore'
import styles from './OnboardingPage.module.css'

export function OnboardingPage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <p className={styles.eyebrow}>Onboarding Required</p>
        <h1 className={styles.title}>Welcome, {user?.fullName || 'new member'}</h1>
        <p className={styles.subtitle}>
          Your account was created successfully. The full 5-step onboarding module is the next build step.
        </p>
        <Button onClick={() => navigate('/auth')} variant="ghost">
          Back to Auth
        </Button>
      </section>
    </main>
  )
}