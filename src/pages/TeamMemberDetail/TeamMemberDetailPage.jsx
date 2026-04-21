import { ArrowLeft, Contact, LoaderCircle, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Footer } from '../../components/layout/Footer/Footer'
import { Navbar } from '../../components/layout/Navbar/Navbar'
import { PageWrapper } from '../../components/layout/PageWrapper/PageWrapper'
import { Button } from '../../components/ui/Button/Button'
import { useAuthStore } from '../../store/authStore'
import { getTeamMemberById } from '../../services/teamMemberService'
import styles from './TeamMemberDetailPage.module.css'

export function TeamMemberDetailPage() {
  const navigate = useNavigate()
  const { memberId } = useParams()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  const [teamName, setTeamName] = useState('MacroBites Product Team')
  const [member, setMember] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadMember = async () => {
      setIsLoading(true)
      setError('')
      try {
        const data = await getTeamMemberById(memberId)
        if (!isMounted) {
          return
        }
        setTeamName(data.teamName || 'MacroBites Product Team')
        setMember(data.member)
      } catch (requestError) {
        if (!isMounted) {
          return
        }
        setError(requestError?.response?.data?.error || 'Unable to load this member right now.')
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    if (memberId) {
      loadMember()
    }

    return () => {
      isMounted = false
    }
  }, [memberId])

  return (
    <div className={styles.page}>
      <Navbar loggedIn={isAuthenticated} />
      <main className={styles.main}>
        <PageWrapper className={styles.wrapper}>
          <Button variant="ghost" className={styles.backButton} onClick={() => navigate('/team/members')}>
            <ArrowLeft size={16} />
            Back to View Members
          </Button>

          <section className={styles.card}>
            <p className={styles.eyebrow}>{teamName}</p>

            {isLoading ? (
              <div className={styles.loadingState}>
                <LoaderCircle size={22} className={styles.spin} />
                <p>Loading team member details...</p>
              </div>
            ) : null}

            {!isLoading && error ? <p className={styles.error}>{error}</p> : null}

            {!isLoading && !error && member ? (
              <>
                <h1>{member.name}</h1>
                <p className={styles.role}>{member.role}</p>

                <div className={styles.infoRow}>
                  <span>
                    <UserRound size={16} />
                    Role
                  </span>
                  <strong>{member.role}</strong>
                </div>

                <div className={styles.infoRow}>
                  <span>
                    <Contact size={16} />
                    Contact
                  </span>
                  <strong>{member.contactInfo}</strong>
                </div>

                <div className={styles.bioCard}>
                  <h2>About</h2>
                  <p>{member.bio || 'No additional bio has been added for this member yet.'}</p>
                </div>
              </>
            ) : null}
          </section>
        </PageWrapper>
      </main>
      <Footer />
    </div>
  )
}
