// Mock calendar data generator
// Format: { YYYY-MM-DD: { dietType: 'veg|non-veg|vegan', isLocked: boolean } }

const DIET_SEQUENCE = ['veg', 'non-veg', 'vegan', 'veg', 'veg', 'non-veg', 'veg'];

const pad2 = (value) => String(value).padStart(2, '0');

const formatDateKey = (year, month, day) => `${year}-${pad2(month)}-${pad2(day)}`;

export const generateMonthlySchedule = (year, month) => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const schedule = {};

  for (let day = 1; day <= daysInMonth; day += 1) {
    schedule[formatDateKey(year, month, day)] = {
      dietType: DIET_SEQUENCE[(day - 1) % DIET_SEQUENCE.length],
      isLocked: false,
    };
  }

  return schedule;
};
