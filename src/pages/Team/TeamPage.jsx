import { PlusCircle, Users, UserRoundSearch } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Footer } from '../../components/layout/Footer/Footer'
import { Navbar } from '../../components/layout/Navbar/Navbar'
import { PageWrapper } from '../../components/layout/PageWrapper/PageWrapper'
import { Button } from '../../components/ui/Button/Button'
import { useAuthStore } from '../../store/authStore'
import styles from './TeamPage.module.css'

const TEAM_PAGES = [
  {
    title: 'Add Member Page',
    text: 'Create a new team member record with role and contact details.',
    to: '/team/add',
    icon: PlusCircle,
    cta: 'Go to Add Member',
  },
  {
    title: 'View Members Page',
    text: 'Browse all members and pick one to inspect complete details.',
    to: '/team/members',
    icon: Users,
    cta: 'Go to View Members',
  },
  {
    title: 'Member Details Page',
    text: 'Open full profile details for any team member from the members list.',
    to: '/team/members',
    icon: UserRoundSearch,
    cta: 'Open Members List',
  },
]

export function TeamPage() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return (
    <div className={styles.page}>
      <Navbar loggedIn={isAuthenticated} />

      <main className={styles.main}>
        <PageWrapper>
          <header className={styles.header}>
            <p className={styles.eyebrow}>MacroBites Product Team</p>
            <h1>Team Workspace</h1>
            <p>Manage members from one place: add members, view all members, and open detailed member profiles.</p>
          </header>

          <section className={styles.grid}>
            {TEAM_PAGES.map((item) => {
              const Icon = item.icon
              return (
                <article key={item.title} className={styles.card}>
                  <span className={styles.iconWrap}>
                    <Icon size={20} />
                  </span>
                  <h2>{item.title}</h2>
                  <p>{item.text}</p>
                  <Button onClick={() => navigate(item.to)}>{item.cta}</Button>
                </article>
              )
            })}
          </section>
        </PageWrapper>
      </main>

      <Footer />
    </div>
  )
}
