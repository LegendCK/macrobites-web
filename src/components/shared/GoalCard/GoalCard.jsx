import { CheckCircle2 } from 'lucide-react'
import styles from './GoalCard.module.css'

export function GoalCard({ title, description, imageClass, selected, onClick }) {
  return (
    <button
      type="button"
      className={[styles.card, selected ? styles.selected : '', 'fadeInUp'].filter(Boolean).join(' ')}
      onClick={onClick}
    >
      <div className={[styles.image, styles[imageClass]].filter(Boolean).join(' ')} />
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.desc}>{description}</p>
      </div>
      <span className={styles.checkmark}>
        <CheckCircle2 size={16} />
      </span>
    </button>
  )
}