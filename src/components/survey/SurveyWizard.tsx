import { ArrowLeft, ArrowRight, Lock, Sparkles } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { SurveyAnswers } from '../../../shared/schema'
import { finalizeDraft, LAST_STEP, STEPS, type useSurvey } from '../../hooks/useSurvey'
import { Button } from '../ui/Button'
import { ProgressSteps } from './ProgressSteps'
import { BudgetStep } from './steps/BudgetStep'
import { ContactStep } from './steps/ContactStep'
import { DiagnosisStep } from './steps/DiagnosisStep'
import { ObjectiveStep } from './steps/ObjectiveStep'
import { UrgencyStep } from './steps/UrgencyStep'

interface Props {
  survey: ReturnType<typeof useSurvey>
  onSubmit: (answers: SurveyAnswers, honeypot: string) => void
}

const variants = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 28 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction * -28 }),
}

export function SurveyWizard({ survey, onSubmit }: Props) {
  const { step, maxStep, direction, draft, errors, dispatch, goTo } = survey
  const [attempted, setAttempted] = useState<Record<number, boolean>>({})
  const [honeypot, setHoneypot] = useState('')
  const headingRef = useRef<HTMLHeadingElement>(null)
  const firstRender = useRef(true)

  useEffect(() => {
    // Lleva el foco al título del paso para lectores de pantalla y teclado.
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    const heading = headingRef.current
    heading?.focus({ preventScroll: true })
    if (heading && heading.getBoundingClientRect().top < 80) {
      heading.closest('section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [step])

  const showAllErrors = Boolean(attempted[step])
  const meta = STEPS[step] ?? STEPS[0]

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (Object.keys(errors).length) {
      setAttempted((a) => ({ ...a, [step]: true }))
      return
    }
    if (step < LAST_STEP) {
      goTo(step + 1)
      return
    }
    const result = finalizeDraft(draft)
    if ('invalidStep' in result) {
      setAttempted((a) => ({ ...a, [result.invalidStep]: true }))
      goTo(result.invalidStep)
      return
    }
    onSubmit(result.answers, honeypot)
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-labelledby="survey-title">
      <ProgressSteps current={step} maxReached={maxStep} onSelect={goTo} />

      {/* Honeypot anti-bots: invisible para personas. */}
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label>
          Sitio web
          <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
        </label>
      </div>

      <div className="relative mt-7 min-h-[320px]">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="mb-6">
              <h2
                id="survey-title"
                ref={headingRef}
                tabIndex={-1}
                className="font-display text-2xl font-semibold tracking-tight text-white outline-none sm:text-[28px]"
              >
                {meta.subtitle}
              </h2>
            </header>

            {step === 0 && (
              <ContactStep contacto={draft.contacto} errors={errors} showAllErrors={showAllErrors} dispatch={dispatch} />
            )}
            {step === 1 && (
              <ObjectiveStep value={draft.objetivo} error={showAllErrors ? errors.objetivo : undefined} dispatch={dispatch} />
            )}
            {step === 2 && (
              <DiagnosisStep
                objetivo={draft.objetivo}
                answers={draft.diagnostico}
                errors={errors}
                showAllErrors={showAllErrors}
                dispatch={dispatch}
              />
            )}
            {step === 3 && (
              <BudgetStep value={draft.presupuesto} error={showAllErrors ? errors.presupuesto : undefined} dispatch={dispatch} />
            )}
            {step === 4 && (
              <UrgencyStep value={draft.urgencia} error={showAllErrors ? errors.urgencia : undefined} dispatch={dispatch} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-6">
        <Button
          type="button"
          variant="ghost"
          onClick={() => goTo(step - 1)}
          disabled={step === 0}
          icon={<ArrowLeft className="size-4" aria-hidden />}
          className={step === 0 ? 'invisible' : ''}
        >
          Atrás
        </Button>
        <Button
          type="submit"
          iconRight={
            step === LAST_STEP ? <Sparkles className="size-4" aria-hidden /> : <ArrowRight className="size-4" aria-hidden />
          }
          className="flex-1 sm:flex-none sm:px-7"
        >
          {step === LAST_STEP ? 'Analizar mi perfil' : 'Continuar'}
        </Button>
      </div>
      <p className="mt-4 text-center text-xs text-balance text-mist">
        <Lock className="mr-1 inline size-3 align-[-1px]" aria-hidden />
        Tus datos se usan solo para preparar tu diagnóstico.
      </p>
    </form>
  )
}
