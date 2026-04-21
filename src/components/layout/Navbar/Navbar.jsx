import { UserCircle } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../store/authStore'
import { Button } from '../../ui/Button/Button'
import styles from './Navbar.module.css'

const LOGGED_OUT_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/team', label: 'Team' },
  { to: '/plans', label: 'Plans' },
]

const LOGGED_IN_LINKS = [
  { to: '/home', label: 'Home' },
  { to: '/team', label: 'Team' },
  { to: '/meals', label: 'Meals' },
  { to: '/plans', label: 'Plans' },
  { to: '/calendar', label: 'Calendar' },
  { to: '/nutritionist', label: 'Nutritionist' },
  { to: '/rewards', label: 'Rewards' },
  { to: '/profile', label: 'Profile' },
]

export function Navbar({ loggedIn = false }) {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)

  const links = loggedIn ? LOGGED_IN_LINKS : LOGGED_OUT_LINKS

  const onLogout = async () => {
    await logout()
    navigate('/auth')
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <NavLink to={loggedIn ? '/home' : '/'} className={styles.logo}>
          MacroBites
        </NavLink>

        <ul className={styles.links}>
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) => [styles.link, isActive ? styles.active : ''].filter(Boolean).join(' ')}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          {loggedIn ? (
            <>
              <button className={styles.avatar} type="button" aria-label="Open profile">
                <UserCircle size={20} />
              </button>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => navigate('/auth')}>
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
