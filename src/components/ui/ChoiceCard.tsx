import { Check } from 'lucide-react'
import type { ReactNode } from 'react'

interface ChoiceCardProps {
  type: 'radio' | 'checkbox'
  name: string
  value: string
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  description?: string
  icon?: ReactNode
  size?: 'lg' | 'sm'
}

/** Opción seleccionable basada en un input nativo (accesible por teclado y lector de pantalla). */
export function ChoiceCard({ type, name, value, checked, onChange, label, description, icon, size = 'lg' }: ChoiceCardProps) {
  const padding = size === 'lg' ? 'p-4' : 'px-3.5 py-3'

  return (
    <label className="group relative block cursor-pointer">
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span
        className={`flex min-h-11 items-center gap-3 rounded-xl border ${padding} transition duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-neon peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-ink ${
          checked
            ? 'border-neon/60 bg-neon/[0.08] shadow-[0_0_0_1px_rgb(0_230_118/0.25),0_8px_30px_-12px_rgb(0_230_118/0.5)]'
            : 'border-white/10 bg-white/[0.025] group-hover:border-white/25 group-hover:bg-white/[0.05]'
        }`}
      >
        {icon && (
          <span
            className={`flex size-10 shrink-0 items-center justify-center rounded-lg transition ${
              checked ? 'bg-neon/15 text-neon' : 'bg-white/5 text-mist group-hover:text-white'
            }`}
            aria-hidden
          >
            {icon}
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className={`block font-medium ${size === 'lg' ? 'text-[15px]' : 'text-sm'} text-white`}>{label}</span>
          {description && <span className="mt-0.5 block text-xs leading-relaxed text-mist">{description}</span>}
        </span>
        <span
          className={`flex size-5 shrink-0 items-center justify-center border transition ${
            type === 'radio' ? 'rounded-full' : 'rounded-md'
          } ${checked ? 'border-neon bg-neon text-[#03140b]' : 'border-white/25'}`}
          aria-hidden
        >
          {checked && <Check className="size-3.5" strokeWidth={3} />}
        </span>
      </span>
    </label>
  )
}
