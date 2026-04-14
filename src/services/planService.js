import { api } from './api.js'

export async function getPlans() {
  const response = await api.get('/plans')
  return response.data
}
