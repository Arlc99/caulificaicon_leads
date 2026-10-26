import { CircleCheckBig, ExternalLink, MessageCircle, RotateCcw } from 'lucide-react'
import { motion } from 'motion/react'
import type { SurveyAnswers } from '../../shared/schema'
import { BRAND, whatsappLink } from '../config/brand'
import { Button, LinkButton } from './ui/Button'

interface Props {
  answers: SurveyAnswers
  onRestart: () => void
}

/**
 * Pantalla final para el cliente: solo agradece y confirma el contacto.
 * El análisis de IA es interno y nunca se muestra aquí (está en Google Sheets).
 */
export function ResultScreen({ answers, onRestart }: Props) {
  const { nombre, empresa } = answers.contacto
  const firstName = nombre.split(/\s+/)[0] ?? nombre
  const greeting = `Hola, soy ${nombre}${empresa ? ` de ${empresa}` : ''}. Acabo de completar el diagnóstico gratuito y me gustaría recibir más información.`

  return (
    <div className="flex flex-col items-center py-4 text-center">
      <motion.div
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 16 }}
        className="flex size-20 items-center justify-center rounded-full bg-neon/12 shadow-glow"
      >
        <CircleCheckBig className="size-10 text-neon" aria-hidden />
      </motion.div>

      <h2 className="mt-6 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
        ¡Gracias por responder, {firstName}!
      </h2>
      <p className="mt-3 max-w-md text-[15px] leading-relaxed text-mist">
        Recibimos tu diagnóstico. Un asesor de {BRAND.name} revisará tu caso y se pondrá en contacto contigo muy pronto.
      </p>
      <p className="mt-2 max-w-md text-[15px] leading-relaxed text-mist">
        Mientras tanto, conoce más sobre nosotros en nuestra página web.
      </p>

      <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row">
        <LinkButton
          href={BRAND.siteUrl}
          target="_blank"
          rel="noopener noreferrer"
          iconRight={<ExternalLink className="size-4" aria-hidden />}
          className="flex-1"
        >
          Visitar nuestra página web
        </LinkButton>
        {BRAND.whatsapp && (
          <LinkButton
            variant="secondary"
            href={whatsappLink(BRAND.whatsapp, greeting)}
            target="_blank"
            rel="noopener noreferrer"
            icon={<MessageCircle className="size-4" aria-hidden />}
            className="flex-1"
          >
            Escríbenos por WhatsApp
          </LinkButton>
        )}
      </div>

      <Button variant="ghost" onClick={onRestart} icon={<RotateCcw className="size-4" aria-hidden />} className="mt-6">
        Responder otro diagnóstico
      </Button>
    </div>
  )
}
