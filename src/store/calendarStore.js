import { create } from 'zustand';

const today = new Date();

const calendarStore = create((set) => ({
  // State
  selectedDate: today,
  viewMonth: new Date(today.getFullYear(), today.getMonth(), 1),
  viewMode: 'monthly', // 'monthly' or 'weekly'
  schedules: {}, // { YYYY-MM-DD: { dietType: 'veg|non-veg|vegan', isLocked: boolean } }
  editingSchedule: null, // { date, dietType, isLocked }
  monthlyOutlook: { veg: 0, nonVeg: 0, vegan: 0 }, // percentages

  // Actions
  setSelectedDate: (date) => set({ selectedDate: date }),
  setViewMonth: (date) => set({ viewMonth: date }),
  setViewMode: (mode) => set({ viewMode: mode }),
  
  setSchedules: (schedules) => set({ schedules }),
  
  setEditingSchedule: (schedule) => set({ editingSchedule: schedule }),
  clearEditingSchedule: () => set({ editingSchedule: null }),

  updateSchedule: (dateStr, dietType) => set((state) => ({
    schedules: {
      ...state.schedules,
      [dateStr]: {
        ...state.schedules[dateStr],
        dietType,
      },
    },
  })),

  setMonthlyOutlook: (outlook) => set({ monthlyOutlook: outlook }),

  // Helpers
  navigateMonth: (direction) =>
    set((state) => {
      const newDate = new Date(state.viewMonth);
      if (direction === 'next') {
        newDate.setMonth(newDate.getMonth() + 1);
      } else if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      }
      return { viewMonth: newDate };
    }),
}));

export default calendarStore;
