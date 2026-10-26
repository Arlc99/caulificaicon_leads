/** Fondo ambiental: rejilla sutil y halos esmeralda. Puramente decorativo. */
export function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="bg-grid absolute inset-0" />
      <div className="absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(16_185_129/0.22),transparent)] blur-2xl" />
      <div className="absolute top-1/3 -right-40 h-[480px] w-[480px] rounded-full bg-[radial-gradient(closest-side,rgb(0_230_118/0.12),transparent)] blur-2xl" />
      <div className="absolute bottom-0 -left-40 h-[420px] w-[420px] rounded-full bg-[radial-gradient(closest-side,rgb(16_185_129/0.1),transparent)] blur-2xl" />
    </div>
  )
}
