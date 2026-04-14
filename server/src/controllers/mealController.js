import Meal from '../models/Meal.js'

export async function getMeals(req, res) {
  const { type, search, sort } = req.query
  const filter = { isActive: true }

  if (type && type !== 'all') {
    filter.type = type
  }

  if (search) {
    const regex = new RegExp(search.trim(), 'i')
    filter.$or = [{ name: regex }, { tags: regex }, { type: regex }]
  }

  const query = Meal.find(filter)

  if (sort === 'protein') {
    query.sort({ 'macros.protein': -1 })
  }

  const meals = await query.exec()
  return res.json(meals)
}
