import { ArrowLeft, FileText, LoaderCircle, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Footer } from '../../components/layout/Footer/Footer'
import { Navbar } from '../../components/layout/Navbar/Navbar'
import { PageWrapper } from '../../components/layout/PageWrapper/PageWrapper'
import { Button } from '../../components/ui/Button/Button'
import { useAuthStore } from '../../store/authStore'
import { getTeamMemberById, resolveTeamMemberImageSource } from '../../services/teamMemberService'
import styles from './TeamMemberDetailPage.module.css'

export function TeamMemberDetailPage() {
  const navigate = useNavigate()
  const { memberId } = useParams()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  const [teamName, setTeamName] = useState('Team MacroBites')
  const [member, setMember] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const memberImageSrc = resolveTeamMemberImageSource(member)

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
        setTeamName(data.teamName || 'Team MacroBites')
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
                <div className={styles.avatarWrap}>
                  {memberImageSrc ? (
                    <img
                      src={memberImageSrc}
                      alt={`${member.name} profile`}
                      className={styles.avatar}
                    />
                  ) : (
                    <div className={styles.avatarFallback}>
                      <UserRound size={44} />
                    </div>
                  )}
                </div>

                <div className={styles.identity}>
                  <h1>{member.name}</h1>
                  <p className={styles.subtitle}>
                    {member.degree || 'N/A'} - {member.year || 'N/A'}
                  </p>
                  <p className={styles.rollNumber}>Roll Number: {member.rollNumber}</p>
                </div>

                <div className={styles.infoRow}>
                  <span>
                    Degree
                  </span>
                  <strong>{member.degree || 'N/A'}</strong>
                </div>

                <div className={styles.infoRow}>
                  <span>
                    <UserRound size={16} />
                    Year
                  </span>
                  <strong>{member.year || 'N/A'}</strong>
                </div>

                <div className={styles.bioCard}>
                  <h2>
                    <FileText size={16} /> About Project
                  </h2>
                  <p>{member.aboutProject || 'No project details added yet.'}</p>
                </div>

                <div className={styles.bioCard}>
                  <h2>Hobbies</h2>
                  {Array.isArray(member.hobbies) && member.hobbies.length > 0 ? (
                    <div className={styles.hobbyChips}>
                      {member.hobbies.map((hobby) => (
                        <span key={hobby} className={styles.hobbyChip}>
                          {hobby}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p>No hobbies added yet.</p>
                  )}
                </div>

                <div className={styles.infoRow}>
                  <span>Certificate</span>
                  <strong>{member.certificate || 'N/A'}</strong>
                </div>

                <div className={styles.infoRow}>
                  <span>Internship</span>
                  <strong>{member.internship || 'N/A'}</strong>
                </div>

                <div className={styles.bioCard}>
                  <h2>About Your Aim</h2>
                  <p>{member.aboutAim || 'No aim details added yet.'}</p>
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
