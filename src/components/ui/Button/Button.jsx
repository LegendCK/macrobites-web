import styles from './Button.module.css'

const VARIANTS = ['primary', 'secondary', 'ghost', 'danger']
const SIZES = ['sm', 'md', 'lg']

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  type = 'button',
  className = '',
  disabled = false,
  children,
  ...props
}) {
  const safeVariant = VARIANTS.includes(variant) ? variant : 'primary'
  const safeSize = SIZES.includes(size) ? size : 'md'

  return (
    <button
      type={type}
      className={[
        styles.btn,
        styles[safeVariant],
        styles[safeSize],
        fullWidth ? styles.fullWidth : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? <span className={styles.spinner} aria-hidden="true" /> : null}
      {children}
    </button>
  )
}