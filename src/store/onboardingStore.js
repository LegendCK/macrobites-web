import { create } from 'zustand'
import { onboardingService } from '../services/onboardingService'
import { useAuthStore } from './authStore'

const initialData = {
  goal: '',
  activityLevel: '',
  age: '',
  weight: '',
  height: '',
  gender: '',
  dietType: '',
  allergies: [],
}

export const useOnboardingStore = create((set, get) => ({
  step: 1,
  data: initialData,
  isSubmitting: false,
  error: '',

  setField: (field, value) => {
    set((state) => ({
      data: {
        ...state.data,
        [field]: value,
      },
      error: '',
    }))
  },

  toggleAllergy: (allergy) => {
    set((state) => {
      const hasAllergy = state.data.allergies.includes(allergy)
      return {
        data: {
          ...state.data,
          allergies: hasAllergy
            ? state.data.allergies.filter((item) => item !== allergy)
            : [...state.data.allergies, allergy],
        },
      }
    })
  },

  nextStep: () => {
    set((state) => ({
      step: Math.min(state.step + 1, 5),
      error: '',
    }))
  },

  prevStep: () => {
    set((state) => ({
      step: Math.max(state.step - 1, 1),
      error: '',
    }))
  },

  setError: (error) => set({ error }),

  submit: async () => {
    set({ isSubmitting: true, error: '' })
    try {
      const { data } = get()
      const response = await onboardingService.submitOnboarding(data)
      useAuthStore.getState().completeOnboarding(response)
      set({ isSubmitting: false })
      return true
    } catch {
      set({ isSubmitting: false, error: 'Unable to save onboarding. Please try again.' })
      return false
    }
  },

  reset: () => {
    set({
      step: 1,
      data: initialData,
      isSubmitting: false,
      error: '',
    })
  },
}))