import styles from './ProgressBar.module.css'

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercent = false,
  showValues = false,
  color = 'default',
}) {
  const safeMax = Math.max(1, max)
  const safeValue = Math.min(Math.max(value, 0), safeMax)
  const percent = Math.round((safeValue / safeMax) * 100)

  return (
    <div className={styles.wrapper}>
      {label || showPercent || showValues ? (
        <div className={styles.meta}>
          <span>{label}</span>
          <span>{showValues ? `${safeValue}/${safeMax}` : showPercent ? `${percent}%` : null}</span>
        </div>
      ) : null}

      <div className={styles.track}>
        <div className={[styles.fill, styles[color] || ''].join(' ')} style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}