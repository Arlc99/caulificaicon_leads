import { useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { FieldError } from './FieldError'

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string
  icon: ReactNode
  error?: string
  hint?: string
}

export function TextField({ label, icon, error, hint, className = '', ...props }: TextFieldProps) {
  const id = useId()
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-white/85">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-mist" aria-hidden>
          {icon}
        </span>
        <input
          {...props}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`min-h-12 w-full rounded-xl border bg-white/[0.03] py-3 pr-4 pl-11 text-base text-white placeholder:text-white/35 transition outline-none focus:bg-white/[0.06] focus:ring-2 sm:text-sm ${
            error
              ? 'border-red-400/60 focus:border-red-400 focus:ring-red-400/25'
              : 'border-white/10 hover:border-white/20 focus:border-neon/60 focus:ring-neon/20'
          }`}
        />
      </div>
      {error ? (
        <FieldError id={`${id}-error`} message={error} />
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1.5 text-xs text-mist">
            {hint}
          </p>
        )
      )}
    </div>
  )
}
