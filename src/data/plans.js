// src/data/plans.js
export const plans = [
  {
    id: 'basic',
    name: 'Basic',
    tier: 'basic',
    pricePerDay: 140,
    billingCycles: {
      kickstarter: { price: 140, period: 'day' },
      weekly: { price: 980, period: 'week' },
      monthly: { price: 4200, period: 'month' },
      halfYearly: { price: 25200, period: '6 months' },
      yearly: { price: 50400, period: 'year' }
    },
    features: [
      'Standard meals',
      'Basic tracking',
      'Standard delivery'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    tier: 'pro',
    pricePerDay: 300,
    billingCycles: {
      kickstarter: { price: 300, period: 'day' },
      weekly: { price: 2100, period: 'week' },
      monthly: { price: 9000, period: 'month' },
      halfYearly: { price: 54000, period: '6 months' },
      yearly: { price: 108000, period: 'year' }
    },
    features: [
      'Customizable macros',
      'Snacks included',
      'Priority delivery',
      'Monthly analysis'
    ],
    highlighted: true
  },
  {
    id: 'elite',
    name: 'Elite',
    tier: 'elite',
    pricePerDay: 800,
    billingCycles: {
      kickstarter: { price: 800, period: 'day' },
      weekly: { price: 5600, period: 'week' },
      monthly: { price: 24000, period: 'month' },
      halfYearly: { price: 144000, period: '6 months' },
      yearly: { price: 288000, period: 'year' }
    },
    features: [
      'Chef gourmet meals',
      '1-on-1 nutritionist',
      'On-demand delivery',
      'Bespoke tracking'
    ]
  }
];

export const billingOptions = [
  { id: 'kickstarter', label: 'Kickstarter', discount: 0 },
  { id: 'weekly', label: 'Weekly', discount: 0 },
  { id: 'monthly', label: 'Monthly', discount: 0 },
  { id: 'halfYearly', label: 'Half-Yearly', discount: 10 },
  { id: 'yearly', label: 'Yearly', discount: 25 }
];