import styles from './Badge.module.css'

export function Badge({ type, variant = 'diet', label, className = '' }) {
  if (variant === 'pill') {
    return <span className={[styles.badge, styles.pill, className].filter(Boolean).join(' ')}>{label}</span>
  }

  const dietLabel =
    type === 'non-veg' || type === 'non_veg' ? 'NON-VEG' : type === 'vegan' ? 'VEGAN' : 'VEG'

  const typeClass = type === 'non-veg' || type === 'non_veg' ? styles.nonVeg : type === 'vegan' ? styles.vegan : styles.veg

  return <span className={[styles.badge, typeClass, className].filter(Boolean).join(' ')}>{dietLabel}</span>
}
