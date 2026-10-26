import { useId } from 'react'
import type { DiagnosisAnswers } from '../../../../shared/schema'
import { getObjective, type DiagnosisQuestion, type ObjectiveId } from '../../../../shared/survey'
import type { StepErrors, SurveyDispatch } from '../../../hooks/useSurvey'
import { ChoiceCard } from '../../ui/ChoiceCard'
import { FieldError } from '../../ui/FieldError'

interface Props {
  objetivo: ObjectiveId | null
  answers: DiagnosisAnswers
  errors: StepErrors
  showAllErrors: boolean
  dispatch: SurveyDispatch
}

/** Opciones como "Ninguno" excluyen al resto en preguntas de selección múltiple. */
const isExclusive = (id: string) => id.startsWith('ningun')

export function DiagnosisStep({ objetivo, answers, errors, showAllErrors, dispatch }: Props) {
  const objective = getObjective(objetivo)
  if (!objective) {
    return <p className="text-sm text-mist">Primero selecciona un objetivo en el paso anterior.</p>
  }

  return (
    <div className="space-y-7">
      <p className="rounded-xl border border-neon/15 bg-neon/[0.04] px-4 py-3 text-sm text-white/80">
        Preguntas para <span className="font-semibold text-neon">{objective.label.toLowerCase()}</span>.
      </p>
      {objective.questions.map((question) => (
        <Question
          key={question.id}
          question={question}
          value={answers[question.id]}
          error={showAllErrors ? errors[question.id] : undefined}
          onChange={(value) => dispatch({ type: 'diagnosis', id: question.id, value })}
        />
      ))}
    </div>
  )
}

interface QuestionProps {
  question: DiagnosisQuestion
  value: string | string[] | undefined
  error?: string
  onChange: (value: string | string[] | undefined) => void
}

function Question({ question, value, error, onChange }: QuestionProps) {
  const id = useId()

  if (question.kind === 'text') {
    const text = typeof value === 'string' ? value : ''
    const max = question.maxLength ?? 500
    return (
      <div>
        <label htmlFor={id} className="block text-[15px] font-medium text-white">
          {question.label}
          {!question.required && <span className="ml-1.5 text-xs font-normal text-mist">(opcional)</span>}
        </label>
        {question.helper && <p className="mt-1 text-xs text-mist">{question.helper}</p>}
        <textarea
          id={id}
          value={text}
          maxLength={max}
          rows={3}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          className="mt-3 w-full resize-y rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-base text-white placeholder:text-white/35 transition outline-none hover:border-white/20 focus:border-neon/60 focus:bg-white/[0.06] focus:ring-2 focus:ring-neon/20 sm:text-sm"
          placeholder="Ej.: tengo una pastelería y quiero vender más por Instagram."
        />
        <p className="mt-1 text-right text-xs text-mist" aria-live="polite">
          {text.length}/{max}
        </p>
        <FieldError message={error} />
      </div>
    )
  }

  const multi = question.kind === 'multi'
  const selected = multi ? (Array.isArray(value) ? value : []) : []

  const toggle = (optionId: string, checked: boolean) => {
    if (!multi) return onChange(optionId)
    if (!checked) return onChange(selected.filter((v) => v !== optionId))
    if (isExclusive(optionId)) return onChange([optionId])
    onChange([...selected.filter((v) => !isExclusive(v)), optionId])
  }

  return (
    <fieldset aria-describedby={question.helper ? `${id}-help` : undefined}>
      <legend className="text-[15px] font-medium text-white">{question.label}</legend>
      {question.helper && (
        <p id={`${id}-help`} className="mt-1 text-xs text-mist">
          {question.helper}
        </p>
      )}
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {question.options?.map((option) => (
          <ChoiceCard
            key={option.id}
            size="sm"
            type={multi ? 'checkbox' : 'radio'}
            name={`${id}-${question.id}`}
            value={option.id}
            checked={multi ? selected.includes(option.id) : value === option.id}
            onChange={(checked) => toggle(option.id, checked)}
            label={option.label}
          />
        ))}
      </div>
      <FieldError message={error} />
    </fieldset>
  )
}
