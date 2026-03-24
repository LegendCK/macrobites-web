import { MOCK_USER } from '../data/user'

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const authService = {
  async register(payload) {
    await wait(350)

    return {
      user: {
        ...MOCK_USER,
        fullName: payload.fullName,
        email: payload.email,
        isOnboarded: false,
      },
      token: 'mock_access_token',
    }
  },

  async login(payload) {
    await wait(300)

    return {
      user: {
        ...MOCK_USER,
        email: payload.email,
      },
      token: 'mock_access_token',
    }
  },

  async logout() {
    await wait(150)
    return { success: true }
  },
}