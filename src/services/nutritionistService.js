import { api } from './api.js'

export async function getNutritionists() {
  const response = await api.get('/nutritionists')
  return response.data
}

export async function getBookedAppointments() {
  const response = await api.get('/nutritionists/bookings')
  return response.data.bookings
}

export async function bookNutritionist(nutritionistId, slot) {
  const response = await api.post(`/nutritionists/${nutritionistId}/book`, { slot })
  return response.data
}
