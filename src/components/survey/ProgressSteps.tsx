import { Check } from 'lucide-react'
import { motion } from 'motion/react'
import { STEPS } from '../../hooks/useSurvey'

interface Props {
  current: number
  maxReached: number
  onSelect: (step: number) => void
}

export function ProgressSteps({ current, maxReached, onSelect }: Props) {
  const percent = Math.round(((current + 1) / STEPS.length) * 100)

  return (
    <nav aria-label="Progreso de la encuesta">
      <div className="mb-3 flex items-center justify-between text-xs font-medium">
        <span className="text-neon">
          Paso {current + 1} de {STEPS.length}
        </span>
        <span className="text-mist">{percent}% completado</span>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label="Avance"
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-brand to-neon shadow-[0_0_12px_rgb(0_230_118/0.6)]"
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>
      <ol className="mt-4 hidden grid-cols-5 gap-2 sm:grid">
        {STEPS.map((step, index) => {
          const done = index < current
          const active = index === current
          const reachable = index <= maxReached && !active
          return (
            <li key={step.id}>
              <button
                type="button"
                disabled={!reachable}
                onClick={() => onSelect(index)}
                aria-current={active ? 'step' : undefined}
                className="flex w-full cursor-pointer flex-col items-center gap-1.5 rounded-lg py-1 text-[11px] font-medium transition disabled:cursor-default enabled:hover:text-white"
              >
                <span
                  className={`flex size-7 items-center justify-center rounded-full border text-xs transition ${
                    active
                      ? 'border-neon bg-neon/15 text-neon shadow-[0_0_16px_rgb(0_230_118/0.35)]'
                      : done
                        ? 'border-brand/60 bg-brand/20 text-neon'
                        : 'border-white/15 text-white/45'
                  }`}
                >
                  {done ? <Check className="size-3.5" strokeWidth={3} aria-hidden /> : index + 1}
                </span>
                <span className={active ? 'text-white' : done ? 'text-white/70' : 'text-white/45'}>{step.title}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
