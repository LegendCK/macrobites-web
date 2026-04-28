import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService } from '../services/authService'

// ---------------------------------------------------------------------------
// In-memory mock user database (localStorage-backed)
// ---------------------------------------------------------------------------
const USERS_KEY = '__macrobites_users__'

const getStoredUsers = () => {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]') } catch { return [] }
}
const saveStoredUsers = (users) => {
  try { localStorage.setItem(USERS_KEY, JSON.stringify(users)) } catch {}
}

const mockLogin = ({ email, password }) => {
  const users = getStoredUsers()
  const match = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
  if (!match) throw new Error('No account found with this email. Please sign up first.')
  if (match.password !== password) throw new Error('Incorrect password. Please try again.')
  const { password: _pwd, ...safeUser } = match
  return safeUser
}

const mockRegister = ({ fullName, email, password }) => {
  const users = getStoredUsers()
  const exists = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
  if (exists) throw new Error('An account with this email already exists. Please sign in.')
  const newUser = {
    id: `usr_${Date.now()}`,
    fullName,
    email: email.trim().toLowerCase(),
    password,
    isOnboarded: false,
    plan: null,
    subscription: null,
    memberSince: new Date().toISOString().slice(0, 10),
    badge: 'New Member',
  }
  saveStoredUsers([...users, newUser])
  const { password: _pwd, ...safeUser } = newUser
  return safeUser
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: '',

      login: async (credentials) => {
        set({ isLoading: true, error: '' })
        try {
          let user
          try {
            const response = await authService.login(credentials)
            user = response.user
          } catch (apiErr) {
            if (apiErr?.response?.status === 401)
              throw new Error('Incorrect password. Please try again.')
            if (apiErr?.response?.status === 404)
              throw new Error('No account found with this email. Please sign up first.')
            if (apiErr?.response) {
              throw new Error(apiErr.response?.data?.message || 'Unable to sign in. Please try again.')
            }
            user = mockLogin(credentials)
          }
          set({ user, isAuthenticated: true, isLoading: false })
          return user
        } catch (err) {
          set({ isLoading: false, error: err.message || 'Unable to sign in. Please try again.' })
          return null
        }
      },

      register: async (payload) => {
        set({ isLoading: true, error: '' })
        try {
          let user
          try {
            const response = await authService.register(payload)
            user = response.user
          } catch (apiErr) {
            if (apiErr?.response?.status === 409)
              throw new Error('An account with this email already exists. Please sign in.')
            if (apiErr?.response) {
              throw new Error(apiErr.response?.data?.message || 'Unable to create account. Please try again.')
            }
            user = mockRegister(payload)
          }
          set({ user, isAuthenticated: true, isLoading: false })
          return user
        } catch (err) {
          set({ isLoading: false, error: err.message || 'Unable to create account. Please try again.' })
          return null
        }
      },

      logout: async () => {
        set({ isLoading: true, error: '' })
        try { await authService.logout() } catch {}
        finally { set({ user: null, isAuthenticated: false, isLoading: false }) }
      },

      restoreSession: async () => {
        set({ isLoading: true, error: '' })
        try {
          const response = await authService.getCurrentUser()
          if (response?.user) {
            set({ user: response.user, isAuthenticated: true, isLoading: false })
          } else {
            set({ user: null, isAuthenticated: false, isLoading: false })
          }
        } catch {
          set({ user: null, isAuthenticated: false, isLoading: false })
        }
      },

      completeOnboarding: ({ onboardingData, macroTargets }) => {
        set((state) => ({
          user: state.user
            ? { ...state.user, isOnboarded: true, onboardingData, macroTargets }
            : state.user,
        }))
      },

      /**
       * Save ONE active subscription plan.
       * Replaces any previous plan — a user can only hold one plan at a time.
       * The result is persisted via zustand/persist so it survives page reloads
       * and tab navigation automatically.
       */
      subscribeToPlan: ({ planId, planName, billingCycle, price }) => {
        set((state) => {
          if (!state.user) return {}

          const renewalDate = (() => {
            const d = new Date()
            if (billingCycle === 'kickstarter') d.setDate(d.getDate() + 1)
            else if (billingCycle === 'weekly')     d.setDate(d.getDate() + 7)
            else if (billingCycle === 'monthly')    d.setMonth(d.getMonth() + 1)
            else if (billingCycle === 'halfYearly') d.setMonth(d.getMonth() + 6)
            else if (billingCycle === 'yearly')     d.setFullYear(d.getFullYear() + 1)
            return d.toISOString().slice(0, 10)
          })()

          const subscription = {
            planId,        // single source of truth
            plan: planName,
            billingCycle,
            price,
            subscribedAt: new Date().toISOString(),
            renewalDate,
          }

          // Also keep the mock localStorage users list in sync
          const users = getStoredUsers()
          const idx = users.findIndex(
            (u) => u.email.toLowerCase() === state.user.email.toLowerCase()
          )
          if (idx !== -1) {
            users[idx] = { ...users[idx], plan: planId, subscription }
            saveStoredUsers(users)
          }

          return {
            user: {
              ...state.user,
              plan: planId,      // single string — only one active plan
              subscription,
            },
          }
        })
      },

      getSubscription: () => get().user?.subscription ?? null,
    }),
    {
      name: 'auth_storage',
      // Persist the full user so plan/subscription survive hard reloads & tab switches
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)