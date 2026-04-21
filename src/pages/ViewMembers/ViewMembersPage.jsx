import { ArrowLeft, LoaderCircle, Users } from 'lucide-react'
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
        <PageWrapper>
          <Button variant="ghost" className={styles.backButton} onClick={() => navigate('/team')}>
            <ArrowLeft size={16} />
            Back to Team
          </Button>

          <header className={styles.header}>
            <p className={styles.eyebrow}>{teamName}</p>
            <h1>
              <Users size={22} />
              View Members
            </h1>
          </header>

          {isLoading ? (
            <div className={styles.loadingState}>
              <LoaderCircle size={18} className={styles.spin} />
              Loading members...
            </div>
          ) : null}

          {!isLoading && error ? <p className={styles.error}>{error}</p> : null}

          {!isLoading && !error && members.length === 0 ? (
            <section className={styles.emptyCard}>
              <p>No members available yet.</p>
              <Button onClick={() => navigate('/team/add')}>Go to Add Member</Button>
            </section>
          ) : null}

          <section className={styles.grid}>
            {members.map((member) => {
              const imageSrc = resolveTeamMemberImageSource(member)

              return (
                <button
                  type="button"
                  key={member.id}
                  className={styles.memberCard}
                  onClick={() => navigate(`/team/members/${member.id}`)}
                >
                  {imageSrc ? <img src={imageSrc} alt={`${member.name} profile`} className={styles.memberAvatar} /> : null}
                  <h2>{member.name}</h2>
                  <p>{member.degree}</p>
                  <span>{member.year}</span>
                  <small>{member.rollNumber}</small>
                </button>
              )
            })}
          </section>
        </PageWrapper>
      </main>

      <Footer />
    </div>
  )
}
