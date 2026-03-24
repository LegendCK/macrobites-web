import { Link } from 'react-router-dom'
import { PageWrapper } from '../PageWrapper/PageWrapper'
import styles from './Footer.module.css'

const FOOTER_COLUMNS = {
  Service: ['Meals', 'Plans', 'Nutritionist'],
  Company: ['About Us', 'Mission', 'Careers'],
  Support: ['Help Center', 'Contact', 'Privacy'],
}

export function Footer() {
  return (
    <footer className={styles.footer}>
      <PageWrapper className={styles.inner}>
        <div className={styles.brand}>
          <p className={styles.brandName}>MacroBites</p>
          <p className={styles.tagline}>Protein-first meals, made simple for modern India.</p>
        </div>

        {Object.entries(FOOTER_COLUMNS).map(([title, links]) => (
          <div key={title} className={styles.col}>
            <h4>{title}</h4>
            <ul>
              {links.map((link) => (
                <li key={link}>
                  <Link to="#">{link}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </PageWrapper>

      <PageWrapper className={styles.bottom}>
        <span>© 2026 MacroBites</span>
        <span>Built for consistency and long-term health</span>
      </PageWrapper>
    </footer>
  )
}
