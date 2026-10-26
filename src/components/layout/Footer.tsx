import { Mail, MapPin } from 'lucide-react'
import { BRAND } from '../../config/brand'

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-mist sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <p>
          © {new Date().getFullYear()} {BRAND.name}
        </p>
        <ul className="flex flex-col gap-2 sm:flex-row sm:gap-6">
          <li className="flex items-center gap-2">
            <MapPin className="size-4 text-brand" aria-hidden /> {BRAND.city}
          </li>
          <li>
            <a href={`mailto:${BRAND.email}`} className="flex items-center gap-2 transition hover:text-white">
              <Mail className="size-4 text-brand" aria-hidden /> {BRAND.email}
            </a>
          </li>
        </ul>
      </div>
    </footer>
  )
}
