import { api } from './api.js'

export async function getMeals(filters = {}) {
  const response = await api.get('/meals', { params: filters })
  return response.data
}
