import { BrainCircuit, Clock, ShieldCheck } from 'lucide-react'
import { motion } from 'motion/react'
import { BRAND } from '../config/brand'

const FEATURES = [
  { icon: Clock, title: 'Menos de 2 minutos', text: 'Cinco pasos cortos, sin llamadas previas.' },
  { icon: BrainCircuit, title: 'Análisis con IA', text: 'Analizamos tus respuestas para recomendarte un plan.' },
  { icon: ShieldCheck, title: 'Datos protegidos', text: 'Solo los usamos para preparar tu propuesta.' },
]

export function Hero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="lg:sticky lg:top-28"
    >
      <p className="inline-flex items-center gap-2 rounded-full border border-neon/25 bg-neon/[0.06] px-3 py-1 text-xs font-medium text-neon">
        <span className="size-1.5 animate-pulse rounded-full bg-neon" aria-hidden />
        Diagnóstico gratuito
      </p>
      <h1 className="mt-5 font-display text-4xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-5xl xl:text-6xl">
        Descubre la estrategia digital que <span className="text-gradient">hará crecer tu negocio</span>
      </h1>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-mist sm:text-lg">
        Responde un diagnóstico breve y el equipo de {BRAND.name} recibirá un análisis de tu caso para contactarte con
        una propuesta concreta.
      </p>

      <ul className="mt-8 hidden gap-4 sm:grid sm:grid-cols-3 lg:grid-cols-1 xl:max-w-md">
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-neon">
              <Icon className="size-5" aria-hidden />
            </span>
            <span>
              <span className="block text-sm font-semibold text-white">{title}</span>
              <span className="block text-sm text-mist">{text}</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-10 hidden lg:block">
        <p className="text-xs font-medium tracking-wider text-white/50 uppercase">Servicios</p>
        <ul className="mt-3 flex max-w-lg flex-wrap gap-2">
          {BRAND.services.map((service) => (
            <li key={service} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/70">
              {service}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}
