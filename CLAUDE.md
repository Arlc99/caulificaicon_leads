# CLAUDE.md

Este archivo orienta a Claude Code (claude.ai/code) cuando trabaja en este repositorio.

## Proyecto

**Cualificación de leads B2B** de Direct Marketing Solutions (agencia de marketing digital en Cali, Colombia). Es una encuesta multipaso: la IA de Groq clasifica cada lead como HOT (ICP), WARM o COLD y genera el canal sugerido, una estrategia de venta en 3 pasos y un script de WhatsApp. Las respuestas y el análisis se guardan en Google Sheets mediante Apps Script.

Instalación, variables de entorno y despliegue para personas: ver [README.md](README.md).

## Stack

- **Frontend:** React 19, TypeScript (estricto), Vite 8, Tailwind CSS v4 (plugin `@tailwindcss/vite`, sin `tailwind.config`), `motion` (importar desde `motion/react`) y `lucide-react` 1.x.
- **IA:** Groq (`https://api.groq.com/openai/v1/chat/completions`, compatible con OpenAI), modelo por defecto `openai/gpt-oss-120b` con `response_format: json_schema` estricto. En modo estricto todas las propiedades van en `required` con `additionalProperties: false`; si cambias `GROQ_MODEL`, usa uno que soporte `json_schema` estricto.
- **Validación:** Zod 4, compartida entre cliente y servidor.
- **Backend:** funciones serverless de Vercel en `api/` (API Web estándar: `export function POST(request: Request)`).
- **Persistencia:** Google Apps Script (`apps-script/Code.gs`) que escribe en Google Sheets.

## Comandos

```bash
npm install          # dependencias
npm run dev          # Vite + API local (/api/*) en http://localhost:5173
npm run build        # tsc -b + vite build
npm run typecheck    # solo TypeScript
npm run lint         # ESLint
```

No hay suite de tests. Verifica los cambios con `npm run lint && npm run build` y probando en el navegador.

## Estructura

```
shared/      Código común cliente/servidor (fuente única de verdad)
  survey.ts    Preguntas, objetivos, rangos de presupuesto, urgencias
  schema.ts    Esquemas Zod, validateDiagnosis, describeAnswers, tipos de API
server/      Lógica de servidor (nunca se importa desde src/)
  handlers.ts  handleSubmit (/api/submit): valida → IA (Groq) → Google Sheets, y responde solo {ok, duplicate}
  groq.ts      Prompt, json_schema estricto, llamada a Groq (API compatible con OpenAI) y validación de la salida
  analysis.ts  analysisSchema (salida de la IA), solo servidor
  sheets.ts    buildLeadRow + POST al webhook de Apps Script
  http.ts      HttpError, postHandler, rate limit, límite de tamaño, control de origen
api/         Adaptadores de Vercel que llaman a server/handlers.ts
apps-script/ Code.gs: doPost(e) con validación, deduplicación y protección contra inyección de fórmulas
src/
  App.tsx              Orquesta las vistas: encuesta → envío/error → agradecimiento
  hooks/useSurvey.ts   Reducer de la encuesta, validación por paso, persistencia en sessionStorage
  hooks/useSubmission.ts  Máquina de estados del envío (sending → done | error)
  lib/api.ts           Cliente fetch de /api/*
  config/brand.ts      Datos de marca verificados + variables VITE_ (sin enlaces al sitio corporativo)
  components/          Header, Hero, SurveyWizard + steps/, AnalyzingScreen, ResultScreen, ui/
```

## Arquitectura y flujo

1. `useSurvey` guarda el borrador y valida cada paso con `validateStep`. Al terminar, `finalizeDraft` valida todo con `surveySchema`.
2. `useSubmission.submit` llama a `POST /api/submit`. El servidor analiza con la IA y guarda en Sheets en la misma llamada; `retry` repite la llamada con el mismo `submissionId`, así que no se duplica la fila.
3. Si el usuario recarga a mitad de un envío, el estado restaurado pasa a `error` para que pueda reintentar.
4. En desarrollo, el plugin `devApi` de `vite.config.ts` monta `/api/*` usando `server.ssrLoadModule('/server/handlers.ts')`. Es el mismo código que corre en Vercel.

## Lógica de negocio

- **Pasos:** Contacto → Objetivo → Diagnóstico condicional → Inversión (COP/mes: <1M, 1–3M, 3–6M, >6M) → Urgencia ("Lo antes posible", "En menos de un mes", "Todavía lo estoy pensando").
- **Objetivos:** `leads_ventas`, `posicionamiento_redes`, `web_ecommerce_automatizacion`. Cada uno tiene sus propias preguntas en `shared/survey.ts`.
- **Contacto:** la encuesta la pueden responder empresas o personas naturales.
  - El nombre debe incluir nombre y apellido.
  - La empresa es opcional. Si llega vacía, `describeAnswers` la sustituye por `NO_COMPANY` ("Sin empresa (persona natural)") tanto para la IA como para Sheets.
  - El correo acepta cualquier dominio (Gmail, Hotmail, corporativo…); solo se valida el formato. No vuelvas a exigir correo corporativo.
  - El WhatsApp se normaliza a dígitos E.164 sin `+`, y un móvil de 10 dígitos que empieza por 3 se toma como colombiano (+57).
- **Opciones exclusivas:** en las preguntas múltiples, una opción cuyo id empieza por `ningun` excluye al resto.
- **Clasificación (prompt en `server/groq.ts`):**
  - HOT: inversión ≥ $3M COP, urgencia "Lo antes posible" o "En menos de un mes", y necesidad alineada con los servicios.
  - COLD: inversión < $1M COP y "Todavía lo estoy pensando", o necesidad difusa.
  - WARM: el resto.
- **Salida de la IA:** `{ clasificacion, canal_sugerido, estrategia_venta[3], script_contacto }`. Se valida con `analysisSchema` (`server/analysis.ts`, solo servidor).

## Tono de los textos

Quien responde puede ser una persona sin conocimientos de marketing. Todo texto visible (preguntas, opciones, botones, mensajes) va en lenguaje sencillo y cercano, tuteando:

- Di "clientes", "clientes potenciales" o "personas interesadas", **nunca "leads"**.
- Evita tecnicismos como "embudo", "conversión", "CRM", "pauta", "landing page", "B2B" o "ICP". Usa "anuncios pagados", "página web", "seguimiento automático a clientes", etc.
- Los ids internos (`leads_ventas`, `captar_leads`…) y los nombres de código no cambian: solo cambian las etiquetas.
- La jerga comercial solo se permite en el prompt de la IA y en las columnas internas de Google Sheets (HOT/WARM/COLD). El `script_contacto` también debe ir en lenguaje sencillo.

## Reglas al modificar

- **Agregar o cambiar preguntas:** edita solo `shared/survey.ts`. La UI, la validación, el prompt y la fila de Sheets lo leen de ahí.
- **Columnas de Sheets:** las claves de `buildLeadRow` (`server/sheets.ts`) deben coincidir con `COLUMNS` en `apps-script/Code.gs`. Tras cambiar el script, hay que publicar una nueva versión de la implementación.
- **Imports:** `server/`, `api/` y `shared/` importan con extensión `.js` (p. ej. `'./http.js'`), necesaria para el ESM de Vercel. `src/` importa sin extensión.
- **Configuración de TypeScript:** `tsconfig.app.json` cubre `src` + `shared` (DOM). `tsconfig.node.json` cubre `server`, `api`, `shared` y `vite.config.ts` (Node).
- **`erasableSyntaxOnly` está activo:** no se pueden usar parameter properties, `enum` ni `namespace`.
- **Iconos:** verifica que existan en `lucide-react` 1.x, porque algunos nombres cambiaron (p. ej. `Building2` no existe, se usa `Building`).
- **Estilos:** los tokens están en `src/index.css` (`@theme`): `ink` #080C0A, `neon` #00E676, `brand` #10B981, `mist`, y `font-display` (Space Grotesk) / `font-sans` (Inter). Utilidades propias: `glass`, `text-gradient`, `bg-grid`.
- **Accesibilidad:**
  - Las opciones usan inputs nativos (`ChoiceCard`).
  - Los errores llevan `role="alert"`.
  - El foco se mueve al título de cada paso.
  - Hay que respetar `MotionConfig reducedMotion="user"`.
  - Los objetivos táctiles miden al menos 44 px.
- **Landing independiente:** la navegación no enlaza al sitio corporativo (directmarketing.com.co): el header solo tiene el logo, que lleva al inicio de la página, y el CTA "Diagnóstico gratis" (`#diagnostico`). No añadas menú de navegación externo. La **única** excepción es el botón "Visitar nuestra página web" de la pantalla final de agradecimiento (`BRAND.siteUrl`).
- **El cliente nunca ve el análisis de IA:** ni en pantalla ni en la respuesta de la API. La clasificación, la estrategia y el script solo se guardan en Google Sheets para el equipo comercial. La pantalla final (`ResultScreen`) solo agradece y confirma que lo contactarán. No vuelvas a devolver el análisis al navegador.
- **Marca:** usa solo datos verificados en directmarketing.com.co (nombre, eslogan, servicios, email, ciudad). No inventes logotipos, teléfonos ni redes sociales. El logotipo oficial se configura con `VITE_BRAND_LOGO_URL`, y el WhatsApp comercial con `VITE_COMPANY_WHATSAPP`.

## Seguridad

- **Secretos:** `GROQ_API_KEY`, `GOOGLE_SHEETS_WEBHOOK_URL` y `GOOGLE_SHEETS_WEBHOOK_SECRET` son solo de servidor. **Nunca** les pongas el prefijo `VITE_` ni las leas desde `src/`, porque Vite publica en el bundle todo lo que empieza por `VITE_`.
- **Defensas de la API:**
  - Honeypot en el campo `website`.
  - Rate limit por IP (en memoria, por instancia).
  - Cuerpo de 32 KB como máximo.
  - `ALLOWED_ORIGINS` opcional.
- **Duplicados:** se evitan con `submissionId` (UUID por encuesta, idempotente), un bloqueo `inFlight` en el cliente y `LockService` + búsqueda por ID en Apps Script.
- **Datos personales:** el borrador se guarda en `sessionStorage`, no en `localStorage`.
- **Archivos:** `.env` está en `.gitignore`. Solo se versiona `.env.example`.

## Herramientas de IA del proyecto

- La skill **UI/UX Pro Max** está instalada en `.claude/skills/ui-ux-pro-max` (`uipro init --ai claude`).
- El **Motion AI Kit** (`npx motion-ai`) es interactivo: hay que ejecutarlo manualmente en una terminal.
