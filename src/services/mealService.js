import { MEALS } from '../data/meals'

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getMeals(filters = {}) {
  await wait(280)

  let result = [...MEALS]

  if (filters.type && filters.type !== 'all') {
    result = result.filter((meal) => meal.type === filters.type)
  }

  if (filters.search?.trim()) {
    const query = filters.search.trim().toLowerCase()
    result = result.filter(
      (meal) =>
        meal.name.toLowerCase().includes(query) ||
        meal.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        meal.type.toLowerCase().includes(query),
    )
  }

  if (filters.sort === 'protein') {
    result.sort((a, b) => b.macros.protein - a.macros.protein)
  }

  return result
}
