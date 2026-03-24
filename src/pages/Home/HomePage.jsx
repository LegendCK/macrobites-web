import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button/Button'
import { useAuthStore } from '../../store/authStore'
import styles from './HomePage.module.css'

export function HomePage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const onLogout = async () => {
    await logout()
    navigate('/auth')
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <p className={styles.eyebrow}>Signed in</p>
        <h1 className={styles.title}>Welcome, {user?.fullName || 'MacroBites Member'}</h1>
        <p className={styles.subtitle}>
          Auth flow is active. Next module can now build the complete logged-in home experience.
        </p>
        <Button variant="secondary" onClick={onLogout}>
          Logout
        </Button>
      </section>
    </main>
  )
}