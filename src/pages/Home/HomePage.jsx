import {
  ChefHat,
  FlaskConical,
  Flame,
  Leaf,
  ShieldCheck,
  Star,
  Truck,
  Trophy,
  UtensilsCrossed,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Footer } from '../../components/layout/Footer/Footer'
import { Navbar } from '../../components/layout/Navbar/Navbar'
import { PageWrapper } from '../../components/layout/PageWrapper/PageWrapper'
import { Button } from '../../components/ui/Button/Button'
import { useAuthStore } from '../../store/authStore'
import styles from './HomePage.module.css'

const FEATURES = [
  {
    title: 'Protein-first meals',
    text: 'Every dish is nutritionist-reviewed for high protein targets.',
    icon: Flame,
  },
  {
    title: 'Desi comfort taste',
    text: 'Regional flavors that stay familiar while improving macros.',
    icon: UtensilsCrossed,
  },
  {
    title: 'Verified nutrition',
    text: 'Plans are designed and checked by certified experts.',
    icon: ShieldCheck,
  },
  {
    title: 'Gamified rewards',
    text: 'Track streaks, unlock badges, and stay consistent each week.',
    icon: Trophy,
  },
]

const MISSION = [
  {
    title: 'Science-Backed',
    text: 'Meal plans calibrated for body goals and Indian lifestyles.',
    icon: FlaskConical,
  },
  {
    title: 'Chef Prepared',
    text: 'Freshly made each day in controlled kitchen environments.',
    icon: ChefHat,
  },
  {
    title: 'Delivered Fresh',
    text: 'Cold-chain logistics keep your nutrition reliable and safe.',
    icon: Truck,
  },
]

const TESTIMONIALS = [
  {
    name: 'Aditi Sharma',
    quote: 'MacroBites made it easy to hit my protein target without giving up home-style taste.',
  },
  {
    name: 'Raghav Menon',
    quote: 'The meal calendar is practical and helped me stay disciplined through my cut.',
  },
  {
    name: 'Neha Kapoor',
    quote: 'I finally understand my macros, and the nutritionist support keeps me confident.',
  },
]

const NEXT_WEEK_MENU = [
  { day: 'Mon', meal: 'Paneer Millet Bowl', type: 'Veg' },
  { day: 'Tue', meal: 'Lemon Herb Chicken', type: 'Non-Veg' },
  { day: 'Wed', meal: 'Tofu Quinoa Stir-fry', type: 'Vegan' },
  { day: 'Thu', meal: 'Masala Egg Wrap', type: 'Veg' },
]

export function HomePage({ mode = 'logged-out' }) {
  const navigate = useNavigate()
  const isLoggedIn = mode === 'logged-in'
  const user = useAuthStore((state) => state.user)

  return (
    <div className={styles.page}>
      <Navbar loggedIn={isLoggedIn} />

      <main>
        <section className={styles.hero}>
          <PageWrapper className={styles.heroInner}>
            <div className={[styles.heroCopy, 'fadeInUp'].join(' ')}>
              <p className={styles.eyebrow}>MacroBites</p>
              <h1>Protein-first meals, made simple.</h1>
              {isLoggedIn ? <p className={styles.welcomeLine}>Welcome back, {user?.fullName || 'Healthy Hero'}</p> : null}
              <p>
                MacroBites helps you build consistency with expert-backed meal plans designed for modern Indian
                routines.
              </p>
              <div className={styles.heroActions}>
                <Button size="lg" onClick={() => navigate(isLoggedIn ? '/meals' : '/auth')}>
                  {isLoggedIn ? 'View Meals' : 'Start Your Plan'}
                </Button>
                <Button variant="secondary" size="lg" onClick={() => navigate('/plans')}>
                  View Plans
                </Button>
              </div>
            </div>

            <div className={[styles.heroVisual, 'scaleIn'].join(' ')}>
              <div className={styles.plateGlow} />
              <div className={styles.plateCard}>
                <Leaf size={20} />
                <strong>178g Protein this week</strong>
                <span>Balanced Indian meals tuned to your goal</span>
              </div>
            </div>
          </PageWrapper>
        </section>

        <section className={styles.section}>
          <PageWrapper>
            <div className={[styles.featureGrid, 'stagger'].join(' ')}>
              {FEATURES.map((item) => {
                const Icon = item.icon
                return (
                  <article key={item.title} className={styles.featureCard}>
                    <span className={styles.featureIcon}>
                      <Icon size={20} />
                    </span>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                )
              })}
            </div>
          </PageWrapper>
        </section>

        <section className={styles.section}>
          <PageWrapper>
            <header className={styles.sectionHeader}>
              <h2>Built to make healthy eating sustainable</h2>
            </header>
            <div className={[styles.missionGrid, 'stagger'].join(' ')}>
              {MISSION.map((item) => {
                const Icon = item.icon
                return (
                  <article key={item.title} className={styles.missionCard}>
                    <div className={styles.missionImage}>
                      <Icon size={34} />
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                )
              })}
            </div>
          </PageWrapper>
        </section>

        <section className={styles.darkSection}>
          <PageWrapper className={styles.darkInner}>
            <div>
              <h2>Everything you need to stay on track</h2>
              <p>
                Plan weekly diet preferences, lock your schedule, and monitor consistency with one dashboard designed
                for momentum.
              </p>
            </div>
            <div className={styles.menuCard}>
              <h3>Next Week Preview</h3>
              <ul>
                {NEXT_WEEK_MENU.map((item) => (
                  <li key={item.day}>
                    <span>{item.day}</span>
                    <strong>{item.meal}</strong>
                    <small>{item.type}</small>
                  </li>
                ))}
              </ul>
            </div>
          </PageWrapper>
        </section>

        <section className={styles.section}>
          <PageWrapper>
            <header className={styles.sectionHeader}>
              <h2>Trusted by members building consistency</h2>
            </header>
            <div className={[styles.testimonialGrid, 'stagger'].join(' ')}>
              {TESTIMONIALS.map((item) => (
                <article key={item.name} className={styles.testimonialCard}>
                  <div className={styles.stars}>
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                  </div>
                  <p>{item.quote}</p>
                  <span>{item.name}</span>
                </article>
              ))}
            </div>
          </PageWrapper>
        </section>
      </main>

      <Footer />
    </div>
  )
}
