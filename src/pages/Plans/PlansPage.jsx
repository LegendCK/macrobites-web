// src/pages/Plans/PlansPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { billingOptions, plans as localPlans } from '../../data/plans.js';
import { getPlans } from '../../services/planService.js';
import { Navbar } from '../../components/layout/Navbar/Navbar';
import { Footer } from '../../components/layout/Footer/Footer';
import { PageWrapper } from '../../components/layout/PageWrapper/PageWrapper';
import { useAuthStore } from '../../store/authStore';
import styles from './PlansPage.module.css';

const PlansPage = () => {
  const navigate = useNavigate();
  const [selectedBilling, setSelectedBilling] = useState('monthly');
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const subscribeToPlan = useAuthStore((state) => state.subscribeToPlan);

  // The ONE active plan id — read directly from persisted user object.
  // This means navigating away and back will still show the correct state.
  const activePlanId = user?.plan ?? null;

  useEffect(() => {
    let mounted = true;
    async function loadPlans() {
      setIsLoading(true);
      try {
        const fetchedPlans = await getPlans();
        if (mounted) setPlans(fetchedPlans);
      } catch {
        // Fall back to local data so the page is never blank
        if (mounted) setPlans(localPlans);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    loadPlans();
    return () => { mounted = false; };
  }, []);

  const getCycle = (plan, billingId) => {
    if (!plan.billingCycles) return null;
    if (Array.isArray(plan.billingCycles)) return plan.billingCycles.find((c) => c.id === billingId);
    return plan.billingCycles[billingId];
  };

  const getPrice  = (plan, billingId) => getCycle(plan, billingId)?.price ?? 0;
  const getPeriod = (billingId) => billingOptions.find((o) => o.id === billingId)?.label.toLowerCase() ?? billingId;
  const getSavings = (billingId) => billingOptions.find((o) => o.id === billingId)?.discount ?? 0;

  const handleSubscribe = (plan) => {
    if (!isAuthenticated) { navigate('/auth'); return; }

    // Clicking an already-active plan does nothing
    if (activePlanId === plan.id) return;

    const price = getPrice(plan, selectedBilling);

    // Store overwrites any previous plan — only ONE plan is ever active
    subscribeToPlan({ planId: plan.id, planName: plan.name, billingCycle: selectedBilling, price });

    setSuccessMessage(
      `You have subscribed to the ${plan.name} plan (${getPeriod(selectedBilling)}) for ₹${price}. Enjoy your meals!`
    );
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  return (
    <div className={styles.page}>
      <Navbar loggedIn={isAuthenticated} />
      <main className={styles.main}>
        <PageWrapper>
          <div className={styles.header}>
            <h1 className={styles.title}>Choose Your Plan</h1>
            <p className={styles.subtitle}>Fuel your performance with protein-first meals</p>
          </div>

          {/* Success banner */}
          {successMessage && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: '10px',
              background: '#e6f9f0', border: '1px solid #22c55e',
              borderRadius: '10px', padding: '14px 18px', marginBottom: '24px',
              color: '#166534', fontSize: '0.9rem', lineHeight: '1.5',
            }}>
              <CheckCircle2 size={20} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Billing Toggle */}
          <div className={styles.billingToggle}>
            {billingOptions.map((option) => (
              <button
                key={option.id}
                className={`${styles.billingButton} ${selectedBilling === option.id ? styles.active : ''}`}
                onClick={() => setSelectedBilling(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Savings Badge */}
          {getSavings(selectedBilling) > 0 && (
            <div className={styles.savingsBadge}>
              SAVE UP TO {getSavings(selectedBilling)}% ON{' '}
              {billingOptions.find((o) => o.id === selectedBilling)?.label.toUpperCase()} PLANS
            </div>
          )}

          {isLoading && <p className={styles.loading}>Loading plans…</p>}

          {/* Plan Cards */}
          <div className={styles.plansGrid}>
            {plans.map((plan) => {
              // Only the one matching plan.id === activePlanId is "current"
              const isCurrent = activePlanId === plan.id;

              return (
                <div
                  key={plan.id}
                  className={`${styles.planCard} ${plan.highlighted ? styles.highlighted : ''}`}
                  style={isCurrent
                    ? { outline: '2px solid #22c55e', outlineOffset: '2px' }
                    : {}}
                >
                  <div className={styles.planHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <h2 className={styles.planName}>{plan.name}</h2>
                      {isCurrent && (
                        <span style={{
                          fontSize: '0.7rem', fontWeight: 700,
                          background: '#22c55e', color: '#fff',
                          borderRadius: '999px', padding: '2px 8px',
                          letterSpacing: '0.03em',
                        }}>
                          CURRENT PLAN
                        </span>
                      )}
                    </div>
                    <div className={styles.price}>
                      <span className={styles.currency}>₹</span>
                      <span className={styles.amount}>{getPrice(plan, selectedBilling)}</span>
                      <span className={styles.period}>/{getPeriod(selectedBilling)}</span>
                    </div>
                  </div>

                  <ul className={styles.features}>
                    {plan.features.map((feature, i) => (
                      <li key={i} className={styles.feature}>{feature}</li>
                    ))}
                  </ul>

                  <button
                    className={styles.subscribeButton}
                    onClick={() => handleSubscribe(plan)}
                    style={isCurrent ? { background: '#22c55e', cursor: 'default' } : {}}
                  >
                    {isCurrent ? `✓ Subscribed to ${plan.name}` : `Subscribe to ${plan.name}`}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Feature Comparison Table */}
          <div className={styles.comparisonSection}>
            <h3 className={styles.comparisonTitle}>Compare All Features</h3>
            <div className={styles.tableContainer}>
              <table className={styles.comparisonTable}>
                <thead>
                  <tr>
                    <th className={styles.tableHeader}>Features</th>
                    {plans.map((p) => <th key={p.id} className={styles.tableHeader}>{p.name}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Standard meals',       true,  true,  true ],
                    ['Basic tracking',       true,  true,  true ],
                    ['Standard delivery',    true,  true,  true ],
                    ['Customizable macros',  false, true,  true ],
                    ['Snacks included',      false, true,  true ],
                    ['Priority delivery',    false, true,  true ],
                    ['Monthly analysis',     false, true,  true ],
                    ['Chef gourmet meals',   false, false, true ],
                    ['1-on-1 nutritionist',  false, false, true ],
                    ['On-demand delivery',   false, false, true ],
                    ['Bespoke tracking',     false, false, true ],
                  ].map(([label, ...vals]) => (
                    <tr key={label}>
                      <td className={styles.tableCell}>{label}</td>
                      {vals.map((v, i) => (
                        <td key={i} className={styles.tableCell}>{v ? '✓' : '✗'}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </PageWrapper>
      </main>
      <Footer />
    </div>
  );
};

export default PlansPage;