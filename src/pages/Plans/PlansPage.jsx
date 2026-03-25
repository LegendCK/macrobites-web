// src/pages/Plans/PlansPage.jsx
import { useState } from 'react';
import { plans, billingOptions } from '../../data/plans.js';
import { Navbar } from '../../components/layout/Navbar/Navbar';
import { Footer } from '../../components/layout/Footer/Footer';
import { PageWrapper } from '../../components/layout/PageWrapper/PageWrapper';
import styles from './PlansPage.module.css';

const PlansPage = () => {
  const [selectedBilling, setSelectedBilling] = useState('monthly');

  const getPrice = (plan, billingId) => {
    return plan.billingCycles[billingId].price;
  };

  const getPeriod = (billingId) => {
    return billingOptions.find(opt => opt.id === billingId).label.toLowerCase();
  };

  const getSavings = (billingId) => {
    return billingOptions.find(opt => opt.id === billingId).discount;
  };

  return (
    <div className={styles.container}>
      <Navbar loggedIn={false} />
      <main>
        <PageWrapper>
          <div className={styles.header}>
            <h1 className={styles.title}>Choose Your Plan</h1>
            <p className={styles.subtitle}>Fuel your performance with protein-first meals</p>
          </div>

      {/* Billing Toggle */}
      <div className={styles.billingToggle}>
        {billingOptions.map(option => (
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
          SAVE UP TO {getSavings(selectedBilling)}% ON {billingOptions.find(opt => opt.id === selectedBilling).label.toUpperCase()} PLANS
        </div>
      )}

      {/* Plan Cards */}
      <div className={styles.plansGrid}>
        {plans.map(plan => (
          <div key={plan.id} className={`${styles.planCard} ${plan.highlighted ? styles.highlighted : ''}`}>
            <div className={styles.planHeader}>
              <h2 className={styles.planName}>{plan.name}</h2>
              <div className={styles.price}>
                <span className={styles.currency}>₹</span>
                <span className={styles.amount}>{getPrice(plan, selectedBilling)}</span>
                <span className={styles.period}>/{getPeriod(selectedBilling)}</span>
              </div>
            </div>
            <ul className={styles.features}>
              {plan.features.map((feature, index) => (
                <li key={index} className={styles.feature}>
                  {feature}
                </li>
              ))}
            </ul>
            <button className={styles.subscribeButton}>
              Subscribe to {plan.name}
            </button>
          </div>
        ))}
      </div>

      {/* Feature Comparison Table */}
      <div className={styles.comparisonSection}>
        <h3 className={styles.comparisonTitle}>Compare All Features</h3>
        <div className={styles.tableContainer}>
          <table className={styles.comparisonTable}>
            <thead>
              <tr>
                <th className={styles.tableHeader}>Features</th>
                {plans.map(plan => (
                  <th key={plan.id} className={styles.tableHeader}>
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={styles.tableCell}>Standard meals</td>
                <td className={styles.tableCell}>✓</td>
                <td className={styles.tableCell}>✓</td>
                <td className={styles.tableCell}>✓</td>
              </tr>
              <tr>
                <td className={styles.tableCell}>Basic tracking</td>
                <td className={styles.tableCell}>✓</td>
                <td className={styles.tableCell}>✓</td>
                <td className={styles.tableCell}>✓</td>
              </tr>
              <tr>
                <td className={styles.tableCell}>Standard delivery</td>
                <td className={styles.tableCell}>✓</td>
                <td className={styles.tableCell}>✓</td>
                <td className={styles.tableCell}>✓</td>
              </tr>
              <tr>
                <td className={styles.tableCell}>Customizable macros</td>
                <td className={styles.tableCell}>✗</td>
                <td className={styles.tableCell}>✓</td>
                <td className={styles.tableCell}>✓</td>
              </tr>
              <tr>
                <td className={styles.tableCell}>Snacks included</td>
                <td className={styles.tableCell}>✗</td>
                <td className={styles.tableCell}>✓</td>
                <td className={styles.tableCell}>✓</td>
              </tr>
              <tr>
                <td className={styles.tableCell}>Priority delivery</td>
                <td className={styles.tableCell}>✗</td>
                <td className={styles.tableCell}>✓</td>
                <td className={styles.tableCell}>✓</td>
              </tr>
              <tr>
                <td className={styles.tableCell}>Monthly analysis</td>
                <td className={styles.tableCell}>✗</td>
                <td className={styles.tableCell}>✓</td>
                <td className={styles.tableCell}>✓</td>
              </tr>
              <tr>
                <td className={styles.tableCell}>Chef gourmet meals</td>
                <td className={styles.tableCell}>✗</td>
                <td className={styles.tableCell}>✗</td>
                <td className={styles.tableCell}>✓</td>
              </tr>
              <tr>
                <td className={styles.tableCell}>1-on-1 nutritionist</td>
                <td className={styles.tableCell}>✗</td>
                <td className={styles.tableCell}>✗</td>
                <td className={styles.tableCell}>✓</td>
              </tr>
              <tr>
                <td className={styles.tableCell}>On-demand delivery</td>
                <td className={styles.tableCell}>✗</td>
                <td className={styles.tableCell}>✗</td>
                <td className={styles.tableCell}>✓</td>
              </tr>
              <tr>
                <td className={styles.tableCell}>Bespoke tracking</td>
                <td className={styles.tableCell}>✗</td>
                <td className={styles.tableCell}>✗</td>
                <td className={styles.tableCell}>✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </PageWrapper>
  </main>
  <Footer />
</div>
  )
}

export default PlansPage;