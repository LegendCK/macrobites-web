import { useNavigate } from 'react-router-dom'
import { Footer } from '../../components/layout/Footer/Footer'
import { Navbar } from '../../components/layout/Navbar/Navbar'
import { PageWrapper } from '../../components/layout/PageWrapper/PageWrapper'
import { Button } from '../../components/ui/Button/Button'
import { useAuthStore } from '../../store/authStore'
import styles from './TeamPage.module.css'

export function TeamPage() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return (
    <div className={styles.page}>
      <Navbar loggedIn={isAuthenticated} />

      <main className={styles.main}>
        <PageWrapper className={styles.wrapper}>
          <header className={styles.header}>
            <h1>TEAM 2</h1>
            <p>Welcome to the Team 2 Management</p>
          </header>

          <section className={styles.manageCard}>
            <h2>Manage Team</h2>
            <div className={styles.actions}>
              <Button
                type="button"
                variant="primary"
                size="lg"
                className={styles.actionButton}
                onClick={() => navigate('/team/add')}
              >
                Add Member
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="lg"
                className={styles.actionButton}
                onClick={() => navigate('/team/members')}
              >
                View Members
              </Button>
            </div>
          </section>
        </PageWrapper>
      </main>

      <Footer />
    </div>
  )
}
