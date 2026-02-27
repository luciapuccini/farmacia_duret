import { NavLink } from 'react-router'
import styles from './CtaButton.module.scss'
import clsx from 'clsx'

interface CtaButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: 'default' | 'almond' | 'card'
  to?: string
}

function CtaButton({ children, onClick, className, variant = 'default', to }: CtaButtonProps) {
  const classNames = clsx(
    styles.ctaButton,
    variant === 'almond' && styles.almond,
    variant === 'card' && styles.card,
    className
  )

  if (to) {
    return (
      <NavLink to={to} className={classNames}>
        {children}
      </NavLink>
    )
  }

  return (
    <button className={classNames} onClick={onClick}>
      {children}
    </button>
  )
}

export default CtaButton
