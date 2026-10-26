import { Wallet } from 'lucide-react'
import { BUDGET_CURRENCY, BUDGET_RANGES, type BudgetId } from '../../../../shared/survey'
import type { SurveyDispatch } from '../../../hooks/useSurvey'
import { ChoiceCard } from '../../ui/ChoiceCard'
import { FieldError } from '../../ui/FieldError'

interface Props {
  value: BudgetId | null
  error?: string
  dispatch: SurveyDispatch
}

export function BudgetStep({ value, error, dispatch }: Props) {
  return (
    <fieldset>
      <legend className="mb-4 text-sm text-mist">
        Inversión mensual aproximada en marketing y tecnología ({BUDGET_CURRENCY}). Nos ayuda a proponerte un plan realista.
      </legend>
      <div className="grid gap-3">
        {BUDGET_RANGES.map((range) => (
          <ChoiceCard
            key={range.id}
            type="radio"
            name="presupuesto"
            value={range.id}
            checked={value === range.id}
            onChange={() => dispatch({ type: 'budget', value: range.id })}
            label={range.label}
            description={range.caption}
            icon={<Wallet className="size-5" />}
          />
        ))}
      </div>
      <FieldError message={error} />
    </fieldset>
  )
}
