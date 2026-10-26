import { BRAND } from '../../config/brand'

/** Cabecera de la landing: independiente del sitio corporativo, sin enlaces externos. */
export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-ink/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a href="#" className="flex min-w-0 items-center gap-3 rounded-lg" aria-label={`${BRAND.name}, volver al inicio`}>
          <Logo />
          <span className="min-w-0 leading-tight">
            <span className="block truncate font-display text-[15px] font-semibold tracking-tight">{BRAND.name}</span>
            <span className="hidden truncate text-[11px] text-mist sm:block">{BRAND.tagline}</span>
          </span>
        </a>

        <a
          href="#diagnostico"
          className="inline-flex min-h-10 shrink-0 items-center rounded-xl border border-neon/40 bg-neon/10 px-4 text-sm font-semibold whitespace-nowrap text-neon transition hover:bg-neon/20"
        >
          <span className="sm:hidden">Empezar</span>
          <span className="hidden sm:inline">Diagnóstico gratis</span>
        </a>
      </div>
    </header>
  )
}

function Logo() {
  if (BRAND.logoUrl) {
    return <img src={BRAND.logoUrl} alt="" className="h-10 w-auto max-w-[120px] object-contain" />
  }
  // Monograma de texto: reemplázalo por el logotipo oficial con VITE_BRAND_LOGO_URL.
  return (
    <span
      className="relative flex size-10 shrink-0 items-center justify-center rounded-xl border border-neon/40 bg-gradient-to-br from-neon/20 to-brand/5 font-display text-sm font-bold text-neon shadow-glow"
      aria-hidden
    >
      DM
    </span>
  )
}
