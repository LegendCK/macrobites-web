import Nutritionist from '../models/Nutritionist.js'
import User from '../models/User.js'

export async function getNutritionists(req, res) {
  const nutritionists = await Nutritionist.find().lean({ virtuals: true })
  const normalized = nutritionists.map((item) => ({
    id: item._id?.toString() || item._id,
    ...item,
  }))
  return res.json(normalized)
}

export async function getBookedAppointments(req, res) {
  const user = await User.findById(req.user._id).populate('appointments.nutritionist').lean()
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  const bookings = (user.appointments || []).map((appointment) => ({
    nutritionistId: appointment.nutritionist?._id?.toString() || appointment.nutritionist,
    slot: appointment.slot,
    nutritionistName: appointment.nutritionist?.name || null,
    bookedAt: appointment.bookedAt,
  }))

  return res.json({ bookings })
}

export async function bookNutritionist(req, res) {
  const { id } = req.params
  const { slot } = req.body
  const nutritionist = await Nutritionist.findById(id)

  if (!nutritionist) {
    return res.status(404).json({ error: 'Nutritionist not found' })
  }

  if (!slot || !nutritionist.available.includes(slot)) {
    return res.status(400).json({ error: 'Please select a valid available slot' })
  }

  const user = await User.findById(req.user._id)
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  const alreadyBooked = user.appointments?.some(
    (appointment) => appointment.nutritionist?.toString() === id && appointment.slot === slot
  )

  if (alreadyBooked) {
    return res.status(409).json({ error: 'This slot is already booked' })
  }

  user.appointments = user.appointments || []
  user.appointments.push({ nutritionist: nutritionist._id, slot })
  await user.save()

  return res.json({ success: true, message: `Booked ${nutritionist.name} for ${slot}` })
}
