import { Building, Mail, MessageCircle, User } from 'lucide-react'
import { useState, type ChangeEvent } from 'react'
import type { ContactInfo } from '../../../../shared/schema'
import type { StepErrors, SurveyDispatch } from '../../../hooks/useSurvey'
import { TextField } from '../../ui/TextField'

interface Props {
  contacto: ContactInfo
  errors: StepErrors
  showAllErrors: boolean
  dispatch: SurveyDispatch
}

export function ContactStep({ contacto, errors, showAllErrors, dispatch }: Props) {
  const [touched, setTouched] = useState<Partial<Record<keyof ContactInfo, boolean>>>({})

  const field = (name: keyof ContactInfo) => ({
    value: contacto[name],
    error: showAllErrors || touched[name] ? errors[name] : undefined,
    onChange: (e: ChangeEvent<HTMLInputElement>) => dispatch({ type: 'contact', field: name, value: e.target.value }),
    onBlur: () => setTouched((t) => ({ ...t, [name]: true })),
  })

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <TextField
        {...field('nombre')}
        label="Nombre completo"
        icon={<User className="size-4" />}
        autoComplete="name"
        placeholder="Ana María Gómez"
        className="sm:col-span-2"
        maxLength={80}
      />
      <TextField
        {...field('empresa')}
        label="Empresa (opcional)"
        icon={<Building className="size-4" />}
        autoComplete="organization"
        placeholder="Déjalo vacío si no aplica"
        maxLength={100}
      />
      <TextField
        {...field('whatsapp')}
        label="WhatsApp"
        icon={<MessageCircle className="size-4" />}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="+57 300 123 4567"
        hint="Incluye el indicativo del país."
        maxLength={20}
      />
      <TextField
        {...field('correo')}
        label="Correo electrónico"
        icon={<Mail className="size-4" />}
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="ana@correo.com"
        className="sm:col-span-2"
        maxLength={120}
      />
    </div>
  )
}
