import styles from './CtaButton.module.scss'
import clsx from 'clsx'

interface CtaButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: 'default' | 'almond' | 'card'
}

function CtaButton({ children, onClick, className, variant = 'default' }: CtaButtonProps) {
  return (
    <button 
      className={clsx(
        styles.ctaButton, 
        variant === 'almond' && styles.almond,
        variant === 'card' && styles.card,
        className
      )} 
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default CtaButton
