import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService } from '../services/authService'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: '',

      login: async (credentials) => {
        set({ isLoading: true, error: '' })
        try {
          const response = await authService.login(credentials)
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          })
          return response.user
        } catch {
          set({ isLoading: false, error: 'Unable to sign in. Please try again.' })
          return null
        }
      },

      register: async (payload) => {
        set({ isLoading: true, error: '' })
        try {
          const response = await authService.register(payload)
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          })
          return response.user
        } catch {
          set({ isLoading: false, error: 'Unable to create account. Please try again.' })
          return null
        }
      },

      logout: async () => {
        set({ isLoading: true, error: '' })
        try {
          await authService.logout()
        } finally {
          set({ user: null, isAuthenticated: false, isLoading: false })
        }
      },

      completeOnboarding: ({ onboardingData, macroTargets }) => {
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                isOnboarded: true,
                onboardingData,
                macroTargets,
              }
            : state.user,
        }))
      },
    }),
    {
      name: 'auth_storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)