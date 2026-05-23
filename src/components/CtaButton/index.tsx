import Link from 'next/link'
import clsx from 'clsx'
import styles from './CtaButton.module.scss'

interface CtaButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: 'default' | 'almond' | 'card'
  href?: string
}

function CtaButton({ children, onClick, className, variant = 'default', href }: CtaButtonProps) {
  const classNames = clsx(
    styles.ctaButton,
    variant === 'almond' && styles.almond,
    variant === 'card' && styles.card,
    className
  )

  if (href) {
    return (
      <Link href={href} className={classNames}>
        {children}
      </Link>
    )
  }

  return (
    <button type="button" className={classNames} onClick={onClick}>
      {children}
    </button>
  )
}

export default CtaButton
