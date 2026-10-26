import { BrainCircuit, PenLine, RotateCcw, TriangleAlert } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import type { SubmissionPhase } from '../hooks/useSubmission'
import { Button } from './ui/Button'

const HINTS = [
  'Revisando tus respuestas…',
  'Entendiendo qué necesita tu negocio…',
  'Preparando tu diagnóstico para nuestro equipo…',
  'Guardando tu información de forma segura…',
]

interface Props {
  phase: SubmissionPhase
  error: string | null
  onRetry: () => void
  onEdit: () => void
}

/** Pantalla mientras se envía la encuesta, o de error con reintento. No muestra resultados del análisis. */
export function AnalyzingScreen({ phase, error, onRetry, onEdit }: Props) {
  const isError = phase === 'error'

  return (
    <div className="flex flex-col items-center py-4 text-center" aria-live="polite">
      {isError ? (
        <div className="flex size-24 items-center justify-center rounded-full border border-red-400/30 bg-red-500/10">
          <TriangleAlert className="size-10 text-red-300" aria-hidden />
        </div>
      ) : (
        <Orb />
      )}

      <h2 className="mt-8 font-display text-2xl font-semibold tracking-tight">
        {isError ? 'No pudimos completar el envío' : 'Enviando tu diagnóstico'}
      </h2>

      {isError ? (
        <p role="alert" className="mt-3 max-w-sm text-sm leading-relaxed text-red-200/90">
          {error}
        </p>
      ) : (
        <RotatingHint />
      )}

      {isError && (
        <div className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:flex-row">
          <Button onClick={onRetry} icon={<RotateCcw className="size-4" aria-hidden />} className="flex-1">
            Reintentar
          </Button>
          <Button variant="secondary" onClick={onEdit} icon={<PenLine className="size-4" aria-hidden />} className="flex-1">
            Revisar respuestas
          </Button>
        </div>
      )}
    </div>
  )
}

function Orb() {
  return (
    <div className="relative flex size-36 items-center justify-center" aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute inset-0 rounded-full border border-neon/40"
          initial={{ scale: 0.6, opacity: 0.7 }}
          animate={{ scale: 1.35, opacity: 0 }}
          transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.8, ease: 'easeOut' }}
        />
      ))}
      <motion.span
        className="absolute inset-3 rounded-full bg-[conic-gradient(from_0deg,transparent,rgb(0_230_118/0.7),transparent_60%)]"
        animate={{ rotate: 360 }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
      />
      <span className="absolute inset-[18px] rounded-full bg-ink" />
      <motion.span
        className="relative flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-neon/25 to-brand/10 shadow-glow"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <BrainCircuit className="size-8 text-neon" />
      </motion.span>
    </div>
  )
}

function RotatingHint() {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % HINTS.length), 2200)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative mt-3 h-6 w-full max-w-sm overflow-hidden text-sm text-mist">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {HINTS[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
