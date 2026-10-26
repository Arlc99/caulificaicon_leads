import { Globe, Megaphone, TrendingUp } from 'lucide-react'
import type { ReactNode } from 'react'
import { OBJECTIVES, type ObjectiveId } from '../../../../shared/survey'
import type { SurveyDispatch } from '../../../hooks/useSurvey'
import { ChoiceCard } from '../../ui/ChoiceCard'
import { FieldError } from '../../ui/FieldError'

const ICONS: Record<ObjectiveId, ReactNode> = {
  leads_ventas: <TrendingUp className="size-5" />,
  posicionamiento_redes: <Megaphone className="size-5" />,
  web_ecommerce_automatizacion: <Globe className="size-5" />,
}

interface Props {
  value: ObjectiveId | null
  error?: string
  dispatch: SurveyDispatch
}

export function ObjectiveStep({ value, error, dispatch }: Props) {
  return (
    <fieldset>
      <legend className="sr-only">Objetivo principal</legend>
      <div className="grid gap-3">
        {OBJECTIVES.map((objective) => (
          <ChoiceCard
            key={objective.id}
            type="radio"
            name="objetivo"
            value={objective.id}
            checked={value === objective.id}
            onChange={() => dispatch({ type: 'objective', value: objective.id })}
            label={objective.label}
            description={objective.description}
            icon={ICONS[objective.id]}
          />
        ))}
      </div>
      <FieldError message={error} />
    </fieldset>
  )
}
