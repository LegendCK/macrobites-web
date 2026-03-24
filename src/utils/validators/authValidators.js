const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const NAME_REGEX = /^[A-Za-z]+(?:[\s'-][A-Za-z]+)+$/

export function validateSignIn({ email, password }) {
  if (!email?.trim()) {
    return 'Email is required.'
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    return 'Please enter a valid email address.'
  }

  if (!password?.trim()) {
    return 'Password is required.'
  }

  if (password.trim().length < 6) {
    return 'Password must be at least 6 characters.'
  }

  return ''
}

export function validateSignUp({ fullName, email, password }) {
  if (!fullName?.trim()) {
    return 'Full name is required.'
  }

  if (fullName.trim().length < 3 || !NAME_REGEX.test(fullName.trim())) {
    return 'Please enter your full name.'
  }

  return validateSignIn({ email, password })
}