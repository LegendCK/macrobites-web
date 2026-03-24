import styles from './Input.module.css'

export function Input({
  label,
  icon,
  error,
  hint,
  id,
  className = '',
  containerClassName = '',
  ...props
}) {
  const inputClassNames = [styles.input, icon ? '' : styles.noIcon, error ? styles.hasError : '', className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={[styles.wrapper, containerClassName].filter(Boolean).join(' ')}>
      {label ? (
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      ) : null}

      <div className={styles.inputWrap}>
        {icon ? <span className={styles.inputIcon}>{icon}</span> : null}
        <input id={id} className={inputClassNames} {...props} />
      </div>

      {error ? <p className={styles.error}>{error}</p> : null}
      {!error && hint ? <p className={styles.hint}>{hint}</p> : null}
    </div>
  )
}