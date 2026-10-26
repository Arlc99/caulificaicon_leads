/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_COMPANY_WHATSAPP?: string
  readonly VITE_BRAND_LOGO_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
