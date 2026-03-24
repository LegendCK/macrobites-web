import { Footer } from '../../components/layout/Footer/Footer'
import { Navbar } from '../../components/layout/Navbar/Navbar'
import { PageWrapper } from '../../components/layout/PageWrapper/PageWrapper'
import styles from './PlaceholderPage.module.css'

export function PlaceholderPage({ title, loggedIn = false }) {
  return (
    <div className={styles.page}>
      <Navbar loggedIn={loggedIn} />
      <PageWrapper className={[styles.body, 'fadeInUp'].join(' ')}>
        <h1>{title}</h1>
        <p>This module is next in the implementation sequence and will be built to spec in upcoming steps.</p>
      </PageWrapper>
      <Footer />
    </div>
  )
}
