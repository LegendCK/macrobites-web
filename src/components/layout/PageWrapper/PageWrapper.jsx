import { createElement } from 'react'

export function PageWrapper({ children, as = 'div', className = '' }) {
  return createElement(as, { className: ['page-wrapper', className].filter(Boolean).join(' ') }, children)
}
