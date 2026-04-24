import { ArrowLeft, LoaderCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Footer } from '../../components/layout/Footer/Footer'
import { Navbar } from '../../components/layout/Navbar/Navbar'
import { PageWrapper } from '../../components/layout/PageWrapper/PageWrapper'
import { Button } from '../../components/ui/Button/Button'
import { getTeamMembers, resolveTeamMemberImageSource } from '../../services/teamMemberService'
import { useAuthStore } from '../../store/authStore'
import styles from './ViewMembersPage.module.css'

export function ViewMembersPage() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  const [teamName, setTeamName] = useState('Team MacroBites')
  const [members, setMembers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadMembers = async () => {
      setIsLoading(true)
      setError('')
      try {
        const data = await getTeamMembers()
        if (!isMounted) {
          return
        }

        setTeamName(data.teamName || 'Team MacroBites')
        setMembers(data.members || [])
      } catch (requestError) {
        if (isMounted) {
          setError(requestError?.response?.data?.error || 'Unable to load team members right now.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadMembers()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className={styles.page}>
      <Navbar loggedIn={isAuthenticated} />

      <main className={styles.main}>
        <PageWrapper className={styles.wrapper}>
          <header className={styles.hero}>
            <h1>MEET OUR AMAZING TEAM</h1>
          </header>

          <Button variant="ghost" className={styles.backButton} onClick={() => navigate('/team')}>
            <ArrowLeft size={16} />
            Back to Team
          </Button>

          <section className={styles.manageCard}>
            <p className={styles.teamName}>{teamName}</p>

            {isLoading ? (
              <div className={styles.loadingState}>
                <LoaderCircle size={18} className={styles.spin} />
                Loading members...
              </div>
            ) : null}

            {!isLoading && error ? <p className={styles.error}>{error}</p> : null}

            {!isLoading && !error && members.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No members available yet.</p>
                <button type="button" className={styles.primaryButton} onClick={() => navigate('/team/add')}>
                  Add Member
                </button>
              </div>
            ) : null}

            <section className={styles.grid}>
              {members.map((member) => {
                const imageSrc = resolveTeamMemberImageSource(member)

                return (
                  <article key={member.id} className={styles.memberCard}>
                    {imageSrc ? <img src={imageSrc} alt={`${member.name} profile`} className={styles.memberImage} /> : null}
                    <div className={styles.memberBody}>
                      <h3>{member.name}</h3>
                      <p className={styles.rollNumber}>Roll Number: {member.rollNumber}</p>
                      <button
                        type="button"
                        className={styles.detailsButton}
                        onClick={() => navigate(`/team/members/${member.id}`)}
                      >
                        View Details
                      </button>
                    </div>
                  </article>
                )
              })}
            </section>
          </section>
        </PageWrapper>
      </main>

      <Footer />
    </div>
  )
}
