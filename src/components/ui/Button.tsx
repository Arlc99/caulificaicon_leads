import { LoaderCircle } from 'lucide-react'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

const base =
  'inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon'

const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-neon to-brand text-[#03140b] shadow-glow hover:brightness-110 active:scale-[0.98] disabled:hover:brightness-100',
  secondary: 'glass text-white hover:border-neon/40 hover:bg-white/[0.07] active:scale-[0.98]',
  ghost: 'text-mist hover:bg-white/5 hover:text-white',
}

interface CommonProps {
  variant?: Variant
  icon?: ReactNode
  iconRight?: ReactNode
  children: ReactNode
  className?: string
}

export function Button({
  variant = 'primary',
  icon,
  iconRight,
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {loading ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : icon}
      {children}
      {!loading && iconRight}
    </button>
  )
}

export function LinkButton({
  variant = 'primary',
  icon,
  iconRight,
  children,
  className = '',
  ...props
}: CommonProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a {...props} className={`${base} ${variants[variant]} ${className}`}>
      {icon}
      {children}
      {iconRight}
    </a>
  )
}
