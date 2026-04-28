// src/pages/Nutritionist/NutritionistPage.jsx
import { useEffect, useMemo, useState } from 'react'
import { CalendarCheck, Clock, HeartPulse, Star, User2, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Footer } from '../../components/layout/Footer/Footer'
import { Navbar } from '../../components/layout/Navbar/Navbar'
import { PageWrapper } from '../../components/layout/PageWrapper/PageWrapper'
import { Button } from '../../components/ui/Button/Button'
import {
  getNutritionists,
  getBookedAppointments,
  bookNutritionist,
} from '../../services/nutritionistService.js'
import { nutritionists as localNutritionists } from '../../data/nutritionists.js'
import styles from './NutritionistPage.module.css'

// ---------------------------------------------------------------------------
// Persist booked sessions in localStorage so they survive page reloads
// ---------------------------------------------------------------------------
const BOOKINGS_KEY = '__macrobites_bookings__'

const loadBookings = () => {
  try { return JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '{}') } catch { return {} }
}
const saveBookings = (b) => {
  try { localStorage.setItem(BOOKINGS_KEY, JSON.stringify(b)) } catch {}
}

// ---------------------------------------------------------------------------
// NutritionistCard — shows booked slot with time when already booked
// ---------------------------------------------------------------------------
function NutritionistCard({ item, onBook, bookedSlot }) {
  const isBooked = Boolean(bookedSlot)

  return (
    <article className={styles.card}>
      <div className={styles.cardContent}>
        <div className={styles.topSection}>
          <div className={styles.avatar} aria-hidden="true">{item.avatar}</div>
          <div className={styles.info}>
            <h3>{item.name}</h3>
            <p className={styles.secondary}>{item.credentials} • {item.experience} experience</p>
            <p className={styles.specialization}>
              <HeartPulse size={14} /> {item.specializations.join(', ')}
            </p>
            <p className={styles.rating}>
              <Star size={14} /> {item.rating} ({item.reviews})
            </p>
          </div>
        </div>

        {/* Show booked appointment time if booked, otherwise show available slots */}
        {isBooked ? (
          <div className={styles.nextSection}>
            <strong>Your appointment</strong>
            <div className={styles.availableRow}>
              <span
                className={styles.slotChip}
                style={{
                  background: 'var(--color-success-bg, #e6f9f0)',
                  color: 'var(--color-success-text, #166534)',
                  border: '1px solid #22c55e',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  fontWeight: 600,
                }}
              >
                <Clock size={12} />
                {bookedSlot}
              </span>
            </div>
          </div>
        ) : (
          <div className={styles.nextSection}>
            <strong>Next available</strong>
            <div className={styles.availableRow}>
              {item.available.slice(0, 3).map((slot) => (
                <button key={`${item.id}-${slot}`} type="button" className={styles.slotChip}>
                  <CalendarCheck size={12} /> {slot}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <Button
        variant={isBooked ? 'danger' : 'primary'}
        size="sm"
        className={isBooked ? styles.bookedButton : ''}
        onClick={() => onBook(item)}
        disabled={isBooked}
      >
        {isBooked ? `✓ Booked — ${bookedSlot}` : 'Book Session'}
      </Button>
    </article>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export function NutritionistPage() {
  const navigate = useNavigate()
  const [nutritionists, setNutritionists] = useState([])
  const [bookingCandidate, setBookingCandidate] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState('')

  // bookedSessions: { [nutritionistId]: slotString }
  // Initialise from localStorage so bookings persist across page reloads
  const [bookedSessions, setBookedSessions] = useState(loadBookings)

  const [isLoading, setIsLoading] = useState(true)
  const [isConfirming, setIsConfirming] = useState(false)
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    async function load() {
      setIsLoading(true)
      setError('')
      try {
        const [items, appointments] = await Promise.all([
          getNutritionists(),
          getBookedAppointments(),
        ])
        if (!mounted) return
        setNutritionists(items)

        // Merge API bookings into local state (API wins for any conflicts)
        if (appointments?.length) {
          const apiBookings = appointments.reduce((map, b) => {
            if (b.nutritionistId) map[b.nutritionistId] = b.slot
            return map
          }, {})
          const merged = { ...loadBookings(), ...apiBookings }
          setBookedSessions(merged)
          saveBookings(merged)
        }
      } catch {
        // Fall back to local nutritionist data
        if (mounted) {
          setNutritionists(localNutritionists)
          if (!Object.keys(loadBookings()).length) {
            setError('Unable to load nutritionists from server. Showing local data.')
          }
        }
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    load()
    return () => { mounted = false }
  }, [])

  const canConfirm = !!bookingCandidate && !!selectedSlot

  const closeModal = () => { setBookingCandidate(null); setSelectedSlot('') }

  const startBooking = (item) => {
    if (bookedSessions[item.id]) return  // already booked
    setBookingCandidate(item)
    setSelectedSlot('')
    setConfirmation('')
  }

  const confirmBooking = async () => {
    if (!bookingCandidate || !selectedSlot) return
    setIsConfirming(true)

    try {
      await bookNutritionist(bookingCandidate.id, selectedSlot)
    } catch {
      // Network failed — proceed anyway with local save
    }

    // Save booking locally (persists across reloads)
    const updated = { ...bookedSessions, [bookingCandidate.id]: selectedSlot }
    setBookedSessions(updated)
    saveBookings(updated)

    setConfirmation(`✓ Confirmed with ${bookingCandidate.name} at ${selectedSlot}.`)
    setIsConfirming(false)
    closeModal()
  }

  const notification = useMemo(() => confirmation, [confirmation])

  return (
    <div className={styles.page}>
      <Navbar loggedIn />

      <main>
        <section className={styles.hero}>
          <PageWrapper>
            <div className={styles.heroContent}>
              <User2 size={28} />
              <h1>Nutritionist Consultations</h1>
              <p>
                Book a live session with a certified nutritionist to design your meal plan,
                adjust macros, and level up results.
              </p>
              <Button variant="secondary" onClick={() => navigate('/plans')}>
                Upgrade Plan
              </Button>
            </div>
          </PageWrapper>
        </section>

        <section className={styles.gridSection}>
          <PageWrapper>
            {isLoading ? <p className={styles.loading}>Loading nutritionists…</p> : null}
            {error ? <p className={styles.error}>{error}</p> : null}

            <div className={styles.grid}>
              {nutritionists.map((item) => {
                const id = item.id ?? item._id
                return (
                  <NutritionistCard
                    key={id}
                    item={{ ...item, id }}
                    onBook={startBooking}
                    bookedSlot={bookedSessions[id] ?? null}
                  />
                )
              })}
            </div>

            {notification
              ? <div className={styles.flash}>{notification}</div>
              : null}
          </PageWrapper>
        </section>

        {/* Booking modal */}
        {bookingCandidate ? (
          <div className={styles.modalOverlay} role="dialog" aria-modal="true">
            <div className={styles.modal}>
              <div className={styles.modalHeader}>
                <h2>Select a time for {bookingCandidate.name}</h2>
                <button type="button" className={styles.closeButton} onClick={closeModal} aria-label="Close">
                  <X size={18} />
                </button>
              </div>

              <div className={styles.slotGrid}>
                {bookingCandidate.available.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    className={[styles.slotButton, selectedSlot === slot ? styles.slotSelected : ''].filter(Boolean).join(' ')}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    <Clock size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                    {slot}
                  </button>
                ))}
              </div>

              {selectedSlot && (
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: '8px 0 0' }}>
                  You are booking: <strong>{bookingCandidate.name}</strong> at <strong>{selectedSlot}</strong>
                </p>
              )}

              <div className={styles.modalActions}>
                <Button size="sm" variant="secondary" onClick={closeModal}>Cancel</Button>
                <Button size="sm" onClick={confirmBooking} disabled={!canConfirm || isConfirming}>
                  {isConfirming ? 'Confirming…' : 'Confirm Booking'}
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  )
}