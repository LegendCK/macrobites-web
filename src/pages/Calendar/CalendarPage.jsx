// src/pages/Calendar/CalendarPage.jsx
import { useState, useEffect, useCallback } from 'react';
import { BarChart3, Copy, CheckCircle2, Lock } from 'lucide-react';
import { Footer } from '../../components/layout/Footer/Footer';
import { Navbar } from '../../components/layout/Navbar/Navbar';
import calendarStore from '../../store/calendarStore';
import {
  getCalendarSchedules,
  getScheduleForDateSync,
  updateSchedule,
  calculateMonthlyOutlook,
  formatDateKey,
  isDateLocked,
} from '../../services/calendarService';
import { PageWrapper } from '../../components/layout/PageWrapper/PageWrapper';
import { Button } from '../../components/ui/Button/Button';
import styles from './CalendarPage.module.css';

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const addDays = (date, days) => {
  const d = new Date(date); d.setDate(d.getDate() + days); return d;
};
const getWeekStart = (date) => {
  const d = new Date(date); d.setDate(d.getDate() - d.getDay()); return d;
};
const getDietColor = (t) =>
  t === 'veg' ? 'var(--color-veg)' : t === 'non-veg' ? 'var(--color-non-veg)' : t === 'vegan' ? 'var(--color-vegan)' : 'var(--color-border)';
const getDietLabel = (t) =>
  t === 'veg' ? 'Veg' : t === 'non-veg' ? 'Non-Veg' : t === 'vegan' ? 'Vegan' : '—';

export default function CalendarPage() {
  const {
    selectedDate, setSelectedDate,
    viewMonth, setViewMonth,
    viewMode, setViewMode,
    schedules, setSchedules,
    editingSchedule, setEditingSchedule,
    updateSchedule: updateStoreSchedule,
    monthlyOutlook, setMonthlyOutlook,
    navigateMonth,
  } = calendarStore();

  const [isCalendarLoading, setIsCalendarLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editingDietType, setEditingDietType] = useState('veg');

  // ── Open a date in the edit panel (always works — uses sync fallback) ────
  const openDateForEdit = useCallback((date, overrideSchedules) => {
    const dateStr = formatDateKey(date);
    const src = overrideSchedules ?? schedules;
    const scheduleData = src[dateStr] || getScheduleForDateSync(dateStr);
    const locked = isDateLocked(date);

    setEditingSchedule({ date, dateStr, dietType: scheduleData.dietType || 'veg', isLocked: locked });
    setEditingDietType(scheduleData.dietType || 'veg');
  }, [schedules, setEditingSchedule]);

  // ── Load calendar data for the visible month ─────────────────────────────
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setIsCalendarLoading(true);
      try {
        const data = await getCalendarSchedules('user-id', viewMonth.getFullYear(), viewMonth.getMonth() + 1);
        if (!mounted) return;
        setSchedules(data || {});
        setMonthlyOutlook(calculateMonthlyOutlook(data || {}));
        setError(null);
        // Re-open selected date so the edit panel reflects freshly loaded data
        openDateForEdit(selectedDate, data || {});
      } catch {
        if (mounted) setError('Unable to connect to server. Showing local data.');
      } finally {
        if (mounted) setIsCalendarLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMonth]);

  // Open today on first mount
  useEffect(() => {
    openDateForEdit(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleDayClick = (date) => {
    setSelectedDate(date);
    setViewMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    openDateForEdit(date);
    setSaveSuccess(false);
  };

  const handleNavigate = (dir) => {
    if (viewMode === 'weekly') {
      const next = addDays(selectedDate, dir === 'next' ? 7 : -7);
      setSelectedDate(next);
      setViewMonth(new Date(next.getFullYear(), next.getMonth(), 1));
      return;
    }
    navigateMonth(dir);
  };

  const handleCopyDate = async () => {
    if (!editingSchedule?.dateStr) return;
    try { await navigator?.clipboard?.writeText(editingSchedule.dateStr); } catch {}
  };

  const handleUpdateSchedule = async () => {
    if (!editingSchedule || !editingDietType) return;
    try {
      setUpdating(true);
      setSaveSuccess(false);
      await updateSchedule(editingSchedule.dateStr, editingDietType);
      updateStoreSchedule(editingSchedule.dateStr, editingDietType);
      const updated = {
        ...schedules,
        [editingSchedule.dateStr]: { dietType: editingDietType, isLocked: editingSchedule.isLocked },
      };
      setMonthlyOutlook(calculateMonthlyOutlook(updated));
      setSchedules(updated);
      setEditingSchedule({ ...editingSchedule, dietType: editingDietType });
      setError(null);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update schedule');
    } finally {
      setUpdating(false);
    }
  };

  // ── Calendar grid helpers ────────────────────────────────────────────────
  const firstDayOfMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
  const lastDayOfMonth  = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0);
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth.getDay(); i++) calendarDays.push(null);
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) calendarDays.push(i);

  const weeklyDates = Array.from({ length: 7 }, (_, i) => addDays(getWeekStart(selectedDate), i));

  const monthName = viewMode === 'weekly'
    ? `Week of ${getWeekStart(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
    : viewMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  const getCell = (dateStr) => schedules[dateStr] || getScheduleForDateSync(dateStr);

  // ── Render ───────────────────────────────────────────────────────────────
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
                <p className={styles.subtitle}>Plan and manage your nutritional preferences for the weeks ahead.</p>
              </div>
              <div className={styles.viewToggle}>
                <button className={`${styles.toggleBtn} ${viewMode === 'monthly' ? styles.active : ''}`} onClick={() => setViewMode('monthly')}>Monthly</button>
                <button className={`${styles.toggleBtn} ${viewMode === 'weekly'  ? styles.active : ''}`} onClick={() => setViewMode('weekly')}>Weekly</button>
              </div>
            </header>

            {error && <div className={styles.error} style={{ marginBottom: 16 }}><p>{error}</p></div>}

            <div className={styles.content}>
              {/* ── Calendar (left) ──────────────────────────────────── */}
              <section className={styles.calendarSection}>
                <div className={styles.monthHeader}>
                  <h2 className={styles.monthTitle}>{monthName}</h2>
                  <div className={styles.monthNav}>
                    <button className={styles.navBtn} onClick={() => handleNavigate('prev')} disabled={isCalendarLoading}>‹</button>
                    <button className={styles.navBtn} onClick={() => handleNavigate('next')} disabled={isCalendarLoading}>›</button>
                  </div>
                </div>

                {/* Legend */}
                <div className={styles.legend}>
                  {[['VEG','var(--color-veg)'],['NON-VEG','var(--color-non-veg)'],['VEGAN','var(--color-vegan)']].map(([l,c])=>(
                    <span key={l} className={styles.legendItem}>
                      <span className={styles.legendDot} style={{ backgroundColor: c }} />{l}
                    </span>
                  ))}
                </div>

                {/* Grid */}
                <div className={`${styles.calendarGrid} ${viewMode === 'weekly' ? styles.calendarGridWeekly : ''}`}>
                  {WEEKDAYS.map((d) => <div key={d} className={styles.dayHeader}>{d}</div>)}

                  {viewMode === 'monthly'
                    ? calendarDays.map((day, idx) => {
                        if (day === null) return <div key={`e-${idx}`} className={styles.emptyDay} />;
                        const cellDate = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day);
                        const dateStr  = formatDateKey(cellDate);
                        const schedule = getCell(dateStr);
                        const locked   = isDateLocked(cellDate);
                        const isSelected = selectedDate.getDate() === day &&
                          selectedDate.getMonth() === viewMonth.getMonth() &&
                          selectedDate.getFullYear() === viewMonth.getFullYear();

                        return (
                          <button
                            key={`d-${day}`}
                            className={`${styles.dayCell} ${isSelected ? styles.selected : ''}`}
                            onClick={() => handleDayClick(cellDate)}
                            style={locked ? { opacity: 0.55 } : {}}
                            title={locked ? 'Locked — changes must be made at least 24 h in advance' : undefined}
                          >
                            <span className={styles.dayNumber} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                              {day}
                              {locked && <Lock size={9} style={{ opacity: 0.6 }} />}
                            </span>
                            <div className={styles.dietPill} style={{ backgroundColor: getDietColor(schedule?.dietType) }}>
                              {getDietLabel(schedule?.dietType)}
                            </div>
                          </button>
                        );
                      })
                    : weeklyDates.map((cellDate) => {
                        const dateStr  = formatDateKey(cellDate);
                        const schedule = getCell(dateStr);
                        const locked   = isDateLocked(cellDate);
                        const isSelected = dateStr === formatDateKey(selectedDate);
                        const isOutside  = cellDate.getMonth() !== viewMonth.getMonth();

                        return (
                          <button
                            key={dateStr}
                            className={`${styles.dayCell} ${isSelected ? styles.selected : ''} ${isOutside ? styles.dayCellOutsideMonth : ''}`}
                            onClick={() => handleDayClick(cellDate)}
                            style={locked ? { opacity: 0.55 } : {}}
                            title={locked ? 'Locked — changes must be made at least 24 h in advance' : undefined}
                          >
                            <span className={styles.dayNumber} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                              {cellDate.getDate()}
                              {locked && <Lock size={9} style={{ opacity: 0.6 }} />}
                            </span>
                            <div className={styles.dietPill} style={{ backgroundColor: getDietColor(schedule?.dietType) }}>
                              {getDietLabel(schedule?.dietType)}
                            </div>
                          </button>
                        );
                      })}
                </div>

                {isCalendarLoading && <div className={styles.calendarLoadingOverlay}><p>Loading month…</p></div>}
              </section>

              {/* ── Edit panel (right) ───────────────────────────────── */}
              <section className={styles.editPanel}>
                {editingSchedule ? (
                  <div className={styles.editContent}>
                    {/* Header */}
                    <div className={styles.editHeader}>
                      <h3 className={styles.editTitle}>
                        {editingSchedule.isLocked ? <Lock size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} /> : null}
                        Edit {editingSchedule.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </h3>
                      <button className={styles.copyBtn} title="Copy date" onClick={handleCopyDate} type="button">
                        <Copy size={18} />
                      </button>
                    </div>

                    <p className={styles.editSubtitle}>
                      Select your meal preference for this day. This will apply to breakfast, lunch, and dinner.
                    </p>

                    {/* Locked banner */}
                    {editingSchedule.isLocked && (
                      <div className={styles.warning} style={{
                        background: '#fef2f2', borderColor: '#f87171', color: '#991b1b', marginBottom: 16,
                        display: 'flex', alignItems: 'flex-start', gap: 8,
                      }}>
                        <Lock size={15} style={{ flexShrink: 0, marginTop: 2 }} />
                        <p style={{ margin: 0 }}>
                          <strong>Locked.</strong> This date is today or in the past. You can only edit dates
                          that are <strong>at least 24 hours ahead</strong> (from tomorrow onwards).
                        </p>
                      </div>
                    )}

                    {/* Diet options */}
                    <div className={styles.dietOptions}>
                      {[
                        { value: 'veg',     label: 'Vegetarian (Veg)',  desc: 'Plant-based proteins + Dairy' },
                        { value: 'non-veg', label: 'Non-Vegetarian',    desc: 'Includes meat & seafood' },
                        { value: 'vegan',   label: 'Strict Vegan',      desc: 'No animal products at all' },
                      ].map(({ value, label, desc }) => (
                        <label
                          key={value}
                          className={`${styles.radioOption} ${editingDietType === value ? styles.radioSelected : ''}`}
                          style={{ cursor: editingSchedule.isLocked ? 'not-allowed' : 'pointer', opacity: editingSchedule.isLocked ? 0.6 : 1 }}
                        >
                          <input
                            type="radio" name="dietType" value={value}
                            checked={editingDietType === value}
                            onChange={(e) => { if (!editingSchedule.isLocked) setEditingDietType(e.target.value); }}
                            disabled={editingSchedule.isLocked || updating}
                          />
                          <span className={styles.radioLabel}>{label}</span>
                          <span className={styles.radioDescription}>{desc}</span>
                        </label>
                      ))}
                    </div>

                    {/* 24h advance notice (only when editable) */}
                    {!editingSchedule.isLocked && (
                      <div className={styles.warning}>
                        <p>Changes must be made <strong>24 hours in advance</strong> of the scheduled delivery date.</p>
                      </div>
                    )}

                    {/* Save success */}
                    {saveSuccess && (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '10px 14px', borderRadius: 8, marginBottom: 12,
                        background: '#e6f9f0', color: '#166534', fontSize: '0.85rem',
                      }}>
                        <CheckCircle2 size={16} />
                        Schedule updated to <strong style={{ marginLeft: 4 }}>{getDietLabel(editingDietType)}</strong>!
                      </div>
                    )}

                    <Button
                      variant="primary" fullWidth
                      onClick={handleUpdateSchedule}
                      disabled={editingSchedule.isLocked || updating}
                      className={styles.updateBtn}
                    >
                      {updating ? 'Updating…' : 'Update Schedule'}
                    </Button>

                    {/* Monthly outlook */}
                    <div className={styles.monthlyOutlook}>
                      <div className={styles.outlookHeader}>
                        <span className={styles.outlookIcon}><BarChart3 size={20} strokeWidth={2.25} /></span>
                        <div>
                          <p className={styles.outlookLabel}>MONTHLY OUTLOOK</p>
                          <h4 className={styles.outlookTitle}>
                            {monthlyOutlook.veg >= monthlyOutlook.nonVeg && monthlyOutlook.veg >= monthlyOutlook.vegan
                              ? 'Predominantly Veg'
                              : monthlyOutlook.nonVeg >= monthlyOutlook.veg && monthlyOutlook.nonVeg >= monthlyOutlook.vegan
                              ? 'Predominantly Non-Veg'
                              : 'Balanced Diet'}
                          </h4>
                        </div>
                      </div>
                      <div className={styles.outlookBar}>
                        {[['veg','var(--color-veg)',monthlyOutlook.veg],['nonVeg','var(--color-non-veg)',monthlyOutlook.nonVeg],['vegan','var(--color-vegan)',monthlyOutlook.vegan]].map(([k,c,v])=>(
                          <div key={k} className={styles.barSegment} style={{ width:`${v}%`, backgroundColor:c }} title={`${v}%`} />
                        ))}
                      </div>
                      <div className={styles.outlookLabels}>
                        <span>{monthlyOutlook.veg}% VEG</span>
                        <span>{monthlyOutlook.nonVeg}% NON-VEG</span>
                        <span>{monthlyOutlook.vegan}% VEGAN</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={styles.noSelection}><p>Select a day to edit</p></div>
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