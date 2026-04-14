import { useEffect, useMemo, useState } from 'react'
import { CalendarCheck, HeartPulse, Star, User2, X } from 'lucide-react'
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
import styles from './NutritionistPage.module.css'

function NutritionistCard({ item, onBook, isBooked }) {
  return (
    <article className={styles.card}>
      <div className={styles.cardContent}>
        <div className={styles.topSection}>
          <div className={styles.avatar} aria-hidden="true">
            {item.avatar}
          </div>
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
      </div>

      <Button
        variant={isBooked ? 'danger' : 'primary'}
        size="sm"
        className={isBooked ? styles.bookedButton : ''}
        onClick={() => onBook(item)}
        disabled={isBooked}
      >
        {isBooked ? 'Booked' : 'Book Session'}
      </Button>
    </article>
  )
}

export function NutritionistPage() {
  const navigate = useNavigate()
  const [nutritionists, setNutritionists] = useState([])
  const [bookingCandidate, setBookingCandidate] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState('')
  const [bookedSessions, setBookedSessions] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isConfirming, setIsConfirming] = useState(false)
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadNutritionists() {
      setIsLoading(true)
      setError('')
      try {
        const [items, appointments] = await Promise.all([
          getNutritionists(),
          getBookedAppointments(),
        ])

        if (mounted) {
          setNutritionists(items)
          setBookedSessions(
            appointments.reduce((map, booking) => {
              if (booking.nutritionistId) {
                map[booking.nutritionistId] = booking.slot
              }
              return map
            }, {})
          )
        }
      } catch {
        if (mounted) {
          setError('Unable to load nutritionists at the moment.')
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    loadNutritionists()

    return () => {
      mounted = false
    }
  }, [])

  const canConfirm = !!bookingCandidate && !!selectedSlot

  const closeModal = () => {
    setBookingCandidate(null)
    setSelectedSlot('')
  }

  const startBooking = (item) => {
    if (bookedSessions[item.id]) {
      return
    }
    setBookingCandidate(item)
    setSelectedSlot('')
    setConfirmation('')
  }

  const confirmBooking = async () => {
    if (!bookingCandidate || !selectedSlot) return
    setIsConfirming(true)

    try {
      await bookNutritionist(bookingCandidate.id, selectedSlot)
      setBookedSessions((prev) => ({ ...prev, [bookingCandidate.id]: selectedSlot }))
      setConfirmation(`Confirmed ${bookingCandidate.name} for ${selectedSlot}.`)
    } catch {
      setConfirmation('Unable to complete booking. Please try again.')
    } finally {
      setIsConfirming(false)
      closeModal()
    }
  }

  const notification = useMemo(() => {
    if (!confirmation) return ''
    return confirmation
  }, [confirmation])

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
                Book a live session with a certified nutritionist to design your meal plan, adjust macros, and level up results.
              </p>
              <Button variant="secondary" onClick={() => navigate('/plans')}>
                Upgrade Plan
              </Button>
            </div>
          </PageWrapper>
        </section>

        <section className={styles.gridSection}>
          <PageWrapper>
            {isLoading ? <p className={styles.loading}>Loading nutritionists...</p> : null}
            {error ? <p className={styles.error}>{error}</p> : null}
            <div className={styles.grid}>
              {nutritionists.map((item) => {
                const itemId = item.id ?? item._id
                return (
                  <NutritionistCard
                    key={itemId}
                    item={{ ...item, id: itemId }}
                    onBook={startBooking}
                    isBooked={Boolean(bookedSessions[itemId])}
                  />
                )
              })}
            </div>
            {notification ? <div className={styles.flash}>{notification}</div> : null}
          </PageWrapper>
        </section>

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
                    className={[
                      styles.slotButton,
                      selectedSlot === slot ? styles.slotSelected : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>

              <div className={styles.modalActions}>
                <Button size="sm" variant="secondary" onClick={closeModal}>
                  Cancel
                </Button>
                <Button size="sm" onClick={confirmBooking} disabled={!canConfirm || isConfirming}>
                  {isConfirming ? 'Confirming...' : 'Confirm Booking'}
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
