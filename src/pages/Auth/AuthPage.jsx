import { Mail, Lock, UserCircle, ArrowRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button/Button'
import { Input } from '../../components/ui/Input/Input'
import { useAuthStore } from '../../store/authStore'
import styles from './AuthPage.module.css'

const TABS = {
  SIGN_IN: 'sign-in',
  SIGN_UP: 'sign-up',
}

export function AuthPage() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const register = useAuthStore((state) => state.register)
  const isLoading = useAuthStore((state) => state.isLoading)
  const storeError = useAuthStore((state) => state.error)

  const [tab, setTab] = useState(TABS.SIGN_IN)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  })
  const [clientError, setClientError] = useState('')

  const isSignUp = tab === TABS.SIGN_UP
  const title = useMemo(() => (isSignUp ? 'Create your account' : 'Welcome back'), [isSignUp])
  const subtitle = useMemo(
    () =>
      isSignUp
        ? 'Build your protein-first routine with MacroBites.'
        : 'Sign in to continue your personalized meal journey.',
    [isSignUp],
  )

  const updateField = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const validate = () => {
    if (isSignUp && !formData.fullName.trim()) {
      return 'Please enter your full name.'
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      return 'Please enter a valid email address.'
    }

    if (!formData.password.trim() || formData.password.trim().length < 6) {
      return 'Password must be at least 6 characters.'
    }

    return ''
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    const validationError = validate()

    if (validationError) {
      setClientError(validationError)
      return
    }

    setClientError('')

    if (isSignUp) {
      const user = await register(formData)
      if (user) {
        navigate('/onboarding')
      }
      return
    }

    const user = await login({
      email: formData.email,
      password: formData.password,
    })

    if (user) {
      navigate('/home')
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.backgroundShape} aria-hidden="true" />
      <section className={styles.card}>
        <header className={styles.header}>
          <p className={styles.brand}>MacroBites</p>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </header>

        <div className={styles.tabSwitch} role="tablist" aria-label="Auth mode switcher">
          <button
            type="button"
            role="tab"
            className={[styles.tab, !isSignUp ? styles.activeTab : ''].filter(Boolean).join(' ')}
            aria-selected={!isSignUp}
            onClick={() => setTab(TABS.SIGN_IN)}
          >
            Sign In
          </button>
          <button
            type="button"
            role="tab"
            className={[styles.tab, isSignUp ? styles.activeTab : ''].filter(Boolean).join(' ')}
            aria-selected={isSignUp}
            onClick={() => setTab(TABS.SIGN_UP)}
          >
            Sign Up
          </button>
        </div>

        <form className={styles.form} onSubmit={onSubmit}>
          {isSignUp ? (
            <Input
              id="fullName"
              label="Full Name"
              icon={<UserCircle size={16} />}
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={updateField('fullName')}
              autoComplete="name"
            />
          ) : null}

          <Input
            id="email"
            label="Email Address"
            icon={<Mail size={16} />}
            placeholder="hello@macrobites.com"
            value={formData.email}
            onChange={updateField('email')}
            autoComplete="email"
          />

          <Input
            id="password"
            label="Password"
            icon={<Lock size={16} />}
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={updateField('password')}
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
          />

          {!isSignUp ? (
            <button type="button" className={styles.forgotPassword}>
              Forgot Password?
            </button>
          ) : null}

          {clientError || storeError ? <p className={styles.error}>{clientError || storeError}</p> : null}

          <Button type="submit" fullWidth loading={isLoading}>
            {isSignUp ? 'Create Account' : 'Sign In'}
            {!isLoading ? <ArrowRight size={16} /> : null}
          </Button>
        </form>
      </section>
    </main>
  )
}