/**
 * Datos de marca verificados en directmarketing.com.co.
 * La landing es independiente: la navegación no enlaza al sitio corporativo.
 * El único enlace al sitio está en la pantalla final de agradecimiento.
 * El logotipo oficial no se incluye: configúralo con VITE_BRAND_LOGO_URL.
 */
export const BRAND = {
  name: 'Direct Marketing Solutions',
  shortName: 'DMS',
  tagline: 'Soluciones Digitales para el Crecimiento de tu Marca',
  siteUrl: 'https://directmarketing.com.co',
  email: 'info@directmarketing.com.co',
  city: 'Cali, Valle del Cauca',
  logoUrl: import.meta.env.VITE_BRAND_LOGO_URL?.trim() ?? '',
  whatsapp: (import.meta.env.VITE_COMPANY_WHATSAPP ?? '').replace(/\D/g, ''),
  services: ['Social Media', 'Desarrollo Web', 'IA Solutions', 'Asesoría', 'Inbound Marketing', 'Audiovisual', 'Pauta', 'Influencer'],
} as const

export function whatsappLink(phoneDigits: string, text: string): string {
  return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(text)}`
}
