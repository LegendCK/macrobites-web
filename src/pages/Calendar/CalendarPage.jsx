import { useState, useEffect, useCallback } from 'react';
import { BarChart3, Copy } from 'lucide-react';
import { Footer } from '../../components/layout/Footer/Footer';
import { Navbar } from '../../components/layout/Navbar/Navbar';
import calendarStore from '../../store/calendarStore';
import {
  getCalendarSchedules,
  getScheduleForDate,
  getScheduleForDateSync,
  updateSchedule,
  calculateMonthlyOutlook,
  formatDateKey,
} from '../../services/calendarService';
import { PageWrapper } from '../../components/layout/PageWrapper/PageWrapper';
import { Button } from '../../components/ui/Button/Button';
import styles from './CalendarPage.module.css';

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const getWeekStart = (date) => {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay());
  return start;
};

const getDietColor = (dietType) => {
  if (dietType === 'veg') return 'var(--color-veg)';
  if (dietType === 'non-veg') return 'var(--color-non-veg)';
  if (dietType === 'vegan') return 'var(--color-vegan)';
  return 'var(--color-border)';
};

const getDietLabel = (dietType) => {
  if (dietType === 'veg') return 'Veg';
  if (dietType === 'non-veg') return 'Non-Veg';
  if (dietType === 'vegan') return 'Vegan';
  return '—';
};

export default function CalendarPage() {
  const {
    selectedDate,
    setSelectedDate,
    viewMonth,
    setViewMonth,
    viewMode,
    setViewMode,
    schedules,
    setSchedules,
    editingSchedule,
    setEditingSchedule,
    updateSchedule: updateStoreSchedule,
    monthlyOutlook,
    setMonthlyOutlook,
    navigateMonth,
  } = calendarStore();

  const [isCalendarLoading, setIsCalendarLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [editingDietType, setEditingDietType] = useState(null);

  const openDateForEdit = useCallback(async (date) => {
    const dateStr = formatDateKey(date);
    try {
      const scheduleData = await getScheduleForDate(dateStr);
      setEditingSchedule({
        date,
        dateStr,
        ...scheduleData,
      });
      setEditingDietType(scheduleData.dietType);
    } catch {
      setError('Failed to load schedule');
    }
  }, [setEditingSchedule]);

  // Load calendar data on mount
  useEffect(() => {
    const loadCalendar = async () => {
      try {
        setIsCalendarLoading(true);
        const data = await getCalendarSchedules(
          'user-id',
          viewMonth.getFullYear(),
          viewMonth.getMonth() + 1
        );
        setSchedules(data || {});

        // Calculate monthly outlook
        const outlook = calculateMonthlyOutlook(data);
        setMonthlyOutlook(outlook);

        setError(null);
      } catch {
        setError('Failed to load calendar');
      } finally {
        setIsCalendarLoading(false);
      }
    };

    loadCalendar();
  }, [viewMonth, setSchedules, setMonthlyOutlook]);

  useEffect(() => {
    openDateForEdit(selectedDate);
  }, [openDateForEdit, selectedDate]);

  // Handle day click
  const handleDayClick = (date) => {
    setSelectedDate(date);
    setViewMonth(new Date(date.getFullYear(), date.getMonth(), 1));
  };

  const handleNavigate = (direction) => {
    if (viewMode === 'weekly') {
      const delta = direction === 'next' ? 7 : -7;
      const nextSelected = addDays(selectedDate, delta);
      setSelectedDate(nextSelected);
      setViewMonth(new Date(nextSelected.getFullYear(), nextSelected.getMonth(), 1));
      return;
    }

    navigateMonth(direction);
  };

  const handleCopyDate = async () => {
    if (!editingSchedule?.dateStr) return;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(editingSchedule.dateStr);
      }
      setError(null);
    } catch {
      setError('Unable to copy date to clipboard');
    }
  };

  // Handle update schedule
  const handleUpdateSchedule = async () => {
    if (!editingSchedule || !editingDietType) return;

    try {
      setUpdating(true);
      await updateSchedule(editingSchedule.dateStr, editingDietType);
      
      // Update store
      updateStoreSchedule(editingSchedule.dateStr, editingDietType);

      // Recalculate outlook
      const updated = {
        ...schedules,
        [editingSchedule.dateStr]: {
          dietType: editingDietType,
          isLocked: false,
        },
      };
      const outlook = calculateMonthlyOutlook(updated);
      setMonthlyOutlook(outlook);

      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to update schedule');
    } finally {
      setUpdating(false);
    }
  };

  // Generate calendar days
  const firstDayOfMonth = new Date(
    viewMonth.getFullYear(),
    viewMonth.getMonth(),
    1
  );
  const lastDayOfMonth = new Date(
    viewMonth.getFullYear(),
    viewMonth.getMonth() + 1,
    0
  );
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const calendarDays = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const weeklyDates = Array.from({ length: 7 }, (_, index) => {
    const weekStart = getWeekStart(selectedDate);
    return addDays(weekStart, index);
  });

  // Format month name
  const monthName =
    viewMode === 'weekly'
      ? `Week of ${getWeekStart(selectedDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}`
      : viewMonth.toLocaleString('default', {
          month: 'long',
          year: 'numeric',
        });

  return (
    <div className={styles.page}>
      <Navbar loggedIn />

      <main>
        <PageWrapper>
          <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
              <div>
                <h1 className={styles.title}>Meal Schedule</h1>
                <p className={styles.subtitle}>
                  Plan and manage your nutritional preferences for the weeks ahead.
                </p>
              </div>
              <div className={styles.viewToggle}>
                <button
                  className={`${styles.toggleBtn} ${
                    viewMode === 'monthly' ? styles.active : ''
                  }`}
                  onClick={() => setViewMode('monthly')}
                >
                  Monthly
                </button>
                <button
                  className={`${styles.toggleBtn} ${
                    viewMode === 'weekly' ? styles.active : ''
                  }`}
                  onClick={() => setViewMode('weekly')}
                >
                  Weekly
                </button>
              </div>
            </header>

            {/* Error message */}
            {error && (
              <div className={styles.error}>
                <p>{error}</p>
              </div>
            )}

            {/* Main content */}
            <div className={styles.content}>
              {/* Calendar section (left) */}
              <section className={styles.calendarSection}>
            {/* Month header with navigation */}
            <div className={styles.monthHeader}>
              <h2 className={styles.monthTitle}>{monthName}</h2>
              <div className={styles.monthNav}>
                <button
                  className={styles.navBtn}
                  onClick={() => handleNavigate('prev')}
                  aria-label="Previous month"
                  disabled={isCalendarLoading}
                >
                  ‹
                </button>
                <button
                  className={styles.navBtn}
                  onClick={() => handleNavigate('next')}
                  aria-label="Next month"
                  disabled={isCalendarLoading}
                >
                  ›
                </button>
              </div>
            </div>

            {/* Legend */}
            <div className={styles.legend}>
              <span className={styles.legendItem}>
                <span
                  className={styles.legendDot}
                  style={{ backgroundColor: 'var(--color-veg)' }}
                />
                VEG
              </span>
              <span className={styles.legendItem}>
                <span
                  className={styles.legendDot}
                  style={{ backgroundColor: 'var(--color-non-veg)' }}
                />
                NON-VEG
              </span>
              <span className={styles.legendItem}>
                <span
                  className={styles.legendDot}
                  style={{ backgroundColor: 'var(--color-vegan)' }}
                />
                VEGAN
              </span>
            </div>

            {/* Calendar grid */}
            <div
              className={`${styles.calendarGrid} ${
                viewMode === 'weekly' ? styles.calendarGridWeekly : ''
              }`}
            >
              {/* Weekday headers */}
              {WEEKDAYS.map((day) => (
                <div key={day} className={styles.dayHeader}>
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {viewMode === 'monthly'
                ? calendarDays.map((day, idx) => {
                    if (day === null) {
                      return <div key={`empty-${idx}`} className={styles.emptyDay} />;
                    }

                    const cellDate = new Date(
                      viewMonth.getFullYear(),
                      viewMonth.getMonth(),
                      day
                    );
                    const dateStr = formatDateKey(cellDate);
                    const schedule = schedules[dateStr] || getScheduleForDateSync(dateStr);
                    const isSelected =
                      selectedDate.getDate() === day &&
                      selectedDate.getMonth() === viewMonth.getMonth() &&
                      selectedDate.getFullYear() === viewMonth.getFullYear();

                    return (
                      <button
                        key={`day-${day}`}
                        className={`${styles.dayCell} ${
                          isSelected ? styles.selected : ''
                        }`}
                        onClick={() => handleDayClick(cellDate)}
                        disabled={isCalendarLoading}
                      >
                        <span className={styles.dayNumber}>{day}</span>
                        <div
                          className={styles.dietPill}
                          style={{
                            backgroundColor: getDietColor(schedule.dietType),
                          }}
                        >
                          {getDietLabel(schedule.dietType)}
                        </div>
                      </button>
                    );
                  })
                : weeklyDates.map((cellDate) => {
                    const dateStr = formatDateKey(cellDate);
                    const schedule = schedules[dateStr] || getScheduleForDateSync(dateStr);
                    const isSelected = dateStr === formatDateKey(selectedDate);
                    const isOutsideCurrentMonth =
                      cellDate.getMonth() !== viewMonth.getMonth() ||
                      cellDate.getFullYear() !== viewMonth.getFullYear();

                    return (
                      <button
                        key={dateStr}
                        className={`${styles.dayCell} ${
                          isSelected ? styles.selected : ''
                        } ${isOutsideCurrentMonth ? styles.dayCellOutsideMonth : ''}`}
                        onClick={() => handleDayClick(cellDate)}
                        disabled={isCalendarLoading}
                      >
                        <span className={styles.dayNumber}>{cellDate.getDate()}</span>
                        <div
                          className={styles.dietPill}
                          style={{
                            backgroundColor: getDietColor(schedule.dietType),
                          }}
                        >
                          {getDietLabel(schedule.dietType)}
                        </div>
                      </button>
                    );
                  })}
            </div>

            {isCalendarLoading && (
              <div className={styles.calendarLoadingOverlay}>
                <p>Loading month...</p>
              </div>
            )}
              </section>

              {/* Edit panel (right) */}
              <section className={styles.editPanel}>
                {editingSchedule ? (
                  <div className={styles.editContent}>
                {/* Header */}
                <div className={styles.editHeader}>
                  <h3 className={styles.editTitle}>
                    Edit {editingSchedule.date.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </h3>
                  <button
                    className={styles.copyBtn}
                    title="Copy date"
                    onClick={handleCopyDate}
                    type="button"
                  >
                    <Copy size={18} />
                  </button>
                </div>

                <p className={styles.editSubtitle}>
                  Select your meal preference for this day. This will apply to
                  breakfast, lunch, and dinner.
                </p>

                {/* Diet type radio options */}
                <div className={styles.dietOptions}>
                  {['veg', 'non-veg', 'vegan'].map((type) => (
                    <label
                      key={type}
                      className={`${styles.radioOption} ${
                        editingDietType === type ? styles.radioSelected : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name="dietType"
                        value={type}
                        checked={editingDietType === type}
                        onChange={(e) => setEditingDietType(e.target.value)}
                        disabled={editingSchedule.isLocked || updating}
                      />
                      <span className={styles.radioLabel}>
                        {type === 'veg' && 'Vegetarian (Veg)'}
                        {type === 'non-veg' && 'Non-Vegetarian'}
                        {type === 'vegan' && 'Strict Vegan'}
                      </span>
                      <span className={styles.radioDescription}>
                        {type === 'veg' && 'Plant-based proteins + Dairy'}
                        {type === 'non-veg' && 'Includes meat & seafood'}
                        {type === 'vegan' && 'No animal products at all'}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Warning message */}
                <div className={styles.warning}>
                  <p>
                    Changes must be made <strong>24 hours in advance</strong> of
                    the scheduled delivery date.
                  </p>
                </div>

                {/* Update button */}
                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleUpdateSchedule}
                  disabled={editingSchedule.isLocked || updating}
                  className={styles.updateBtn}
                >
                  {updating ? 'Updating...' : 'Update Schedule'}
                </Button>

                {/* Monthly outlook */}
                <div className={styles.monthlyOutlook}>
                  <div className={styles.outlookHeader}>
                    <span className={styles.outlookIcon}>
                      <BarChart3 size={20} strokeWidth={2.25} />
                    </span>
                    <div>
                      <p className={styles.outlookLabel}>MONTHLY OUTLOOK</p>
                      <h4 className={styles.outlookTitle}>
                        {monthlyOutlook.veg > monthlyOutlook.nonVeg &&
                        monthlyOutlook.veg > monthlyOutlook.vegan
                          ? 'Predominantly Veg'
                          : monthlyOutlook.nonVeg > monthlyOutlook.veg &&
                            monthlyOutlook.nonVeg > monthlyOutlook.vegan
                          ? 'Predominantly Non-Veg'
                          : 'Balanced Diet'}
                      </h4>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className={styles.outlookBar}>
                    <div
                      className={styles.barSegment}
                      style={{
                        width: `${monthlyOutlook.veg}%`,
                        backgroundColor: 'var(--color-veg)',
                      }}
                      title={`${monthlyOutlook.veg}% Veg`}
                    />
                    <div
                      className={styles.barSegment}
                      style={{
                        width: `${monthlyOutlook.nonVeg}%`,
                        backgroundColor: 'var(--color-non-veg)',
                      }}
                      title={`${monthlyOutlook.nonVeg}% Non-Veg`}
                    />
                    <div
                      className={styles.barSegment}
                      style={{
                        width: `${monthlyOutlook.vegan}%`,
                        backgroundColor: 'var(--color-vegan)',
                      }}
                      title={`${monthlyOutlook.vegan}% Vegan`}
                    />
                  </div>

                    <div className={styles.outlookLabels}>
                      <span>{monthlyOutlook.veg}% VEG</span>
                      <span>{monthlyOutlook.nonVeg}% NON-VEG</span>
                      <span>{monthlyOutlook.vegan}% VEGAN</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.noSelection}>
                  <p>Select a day to edit</p>
                </div>
              )}
              </section>
            </div>
          </div>
        </PageWrapper>
      </main>

      <Footer />
    </div>
  );
}
