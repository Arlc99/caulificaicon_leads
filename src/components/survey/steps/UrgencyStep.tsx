import { CalendarClock, Hourglass, Zap } from 'lucide-react'
import type { ReactNode } from 'react'
import { URGENCY_LEVELS, type UrgencyId } from '../../../../shared/survey'
import type { SurveyDispatch } from '../../../hooks/useSurvey'
import { ChoiceCard } from '../../ui/ChoiceCard'
import { FieldError } from '../../ui/FieldError'

const ICONS: Record<UrgencyId, ReactNode> = {
  inmediata: <Zap className="size-5" />,
  menos_1_mes: <CalendarClock className="size-5" />,
  evaluacion: <Hourglass className="size-5" />,
}

interface Props {
  value: UrgencyId | null
  error?: string
  dispatch: SurveyDispatch
}

export function UrgencyStep({ value, error, dispatch }: Props) {
  return (
    <fieldset>
      <legend className="sr-only">Urgencia de implementación</legend>
      <div className="grid gap-3">
        {URGENCY_LEVELS.map((level) => (
          <ChoiceCard
            key={level.id}
            type="radio"
            name="urgencia"
            value={level.id}
            checked={value === level.id}
            onChange={() => dispatch({ type: 'urgency', value: level.id })}
            label={level.label}
            description={level.caption}
            icon={ICONS[level.id]}
          />
        ))}
      </div>
      <FieldError message={error} />
    </fieldset>
  )
}
