import { Activity, Dumbbell, Leaf, Target, UtensilsCrossed } from 'lucide-react'

export const GOAL_OPTIONS = [
  {
    value: 'gain_muscle',
    title: 'Gain Muscle',
    description: 'Focus on high protein and a controlled calorie surplus for strength.',
    imageClass: 'goalGain',
  },
  {
    value: 'lose_fat',
    title: 'Lose Fat',
    description: 'Prioritize satiety and a calorie deficit while maintaining muscle mass.',
    imageClass: 'goalLose',
  },
  {
    value: 'stay_fit',
    title: 'Stay Fit',
    description: 'Maintain your current weight and optimize energy with balanced meals.',
    imageClass: 'goalFit',
  },
]

export const ACTIVITY_OPTIONS = [
  {
    value: 'sedentary',
    label: 'Sedentary',
    description: 'Office job, little exercise',
    icon: Target,
  },
  {
    value: 'moderate',
    label: 'Moderate',
    description: 'Active daily, light exercise',
    icon: Activity,
  },
  {
    value: 'active',
    label: 'Active',
    description: 'Regular intense workouts',
    icon: Dumbbell,
  },
]

export const DIET_OPTIONS = [
  {
    value: 'veg',
    label: 'Veg',
    description: 'Plant-based with dairy or eggs',
    icon: Leaf,
  },
  {
    value: 'non_veg',
    label: 'Non-Veg',
    description: 'Includes meat, poultry, and fish',
    icon: UtensilsCrossed,
  },
  {
    value: 'vegan',
    label: 'Vegan',
    description: 'Strictly plant-based',
    icon: Leaf,
  },
]

export const ALLERGY_OPTIONS = ['Gluten', 'Nuts', 'Soy', 'Dairy', 'Shellfish']

export const GENDER_OPTIONS = ['Male', 'Female', 'Other', 'Prefer not to say']