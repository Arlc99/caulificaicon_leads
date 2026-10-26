# Diagnóstico B2B · Direct Marketing Solutions

Aplicación web de cualificación de leads B2B: una encuesta multipaso con lógica condicional. La IA de Groq clasifica cada lead (HOT / WARM / COLD) y propone el canal, la estrategia y el script de contacto. Las respuestas y el análisis se guardan en Google Sheets para el equipo comercial; el cliente solo ve una pantalla de agradecimiento.

**Stack:** React 19, TypeScript, Vite, Tailwind CSS v4, Motion, lucide-react y Zod. El backend son funciones serverless en Vercel, y la hoja se escribe con Google Apps Script.

## Flujo

```
Navegador ──POST /api/submit──▶ Función serverless ──▶ Groq API (análisis; la API key vive solo en el servidor)
          ◀── { ok: true } ──┘                    └──▶ Apps Script doPost(e) ──▶ Google Sheets
```

1. **Contacto:** nombre completo, empresa (opcional, para personas naturales), correo de cualquier dominio y WhatsApp.
2. **Objetivo:** leads y ventas, posicionamiento y redes, o web, e-commerce y automatización.
3. **Diagnóstico:** preguntas condicionales según el objetivo.
4. **Inversión:** rangos mensuales configurables en COP.
5. **Urgencia:** inmediata, en menos de un mes o en evaluación.

Las preguntas, los rangos y las urgencias se editan en [`shared/survey.ts`](shared/survey.ts).

## Instalación

Requisitos: Node 20 o superior y npm.

```bash
npm install
```

```bash
cp .env.example .env
```

Completa `.env`:

| Variable | Dónde se usa | Descripción |
|---|---|---|
| `GROQ_API_KEY` | Servidor | Clave de [Groq](https://console.groq.com/keys). |
| `GROQ_MODEL` | Servidor | Opcional. Por defecto `openai/gpt-oss-120b` (debe soportar `json_schema` estricto). |
| `GOOGLE_SHEETS_WEBHOOK_URL` | Servidor | URL `/exec` del Apps Script. |
| `GOOGLE_SHEETS_WEBHOOK_SECRET` | Servidor | Opcional (recomendado). Debe ser igual a `WEBHOOK_SECRET` en Apps Script. |
| `ALLOWED_ORIGINS` | Servidor | Opcional. Orígenes permitidos, separados por coma. |
| `VITE_COMPANY_WHATSAPP` | Cliente | Número comercial, p. ej. `573001234567`. Si está vacío, se muestra un botón de correo. |
| `VITE_BRAND_LOGO_URL` | Cliente | Opcional. URL del logotipo oficial. |

> **Seguridad:** las claves no llevan el prefijo `VITE_`. Vite solo publica en el navegador las variables que empiezan por `VITE_`, así que con ese prefijo la API key de Groq quedaría expuesta. Por eso las claves solo se leen en `server/`.

```bash
npm run dev
```

En desarrollo, Vite sirve también `/api/*` con el mismo código que se despliega en Vercel (plugin `devApi` en `vite.config.ts`).

## Google Sheets (Apps Script)

1. Crea una hoja de cálculo y abre **Extensiones → Apps Script**.
2. Pega el contenido de [`apps-script/Code.gs`](apps-script/Code.gs).
3. Opcional: en **Configuración del proyecto → Propiedades del script**, añade `WEBHOOK_SECRET`.
4. Ve a **Implementar → Nueva implementación → Aplicación web**, con *Ejecutar como: Yo* y *Acceso: Cualquier persona*.
5. Copia la URL `/exec` en `GOOGLE_SHEETS_WEBHOOK_URL`.

El script crea la hoja `Leads` con encabezados. También descarta envíos duplicados (mismo `submissionId`) y neutraliza fórmulas para evitar inyección en la hoja. Cada cambio en el script exige publicar una nueva versión de la implementación.

## Despliegue en Vercel

1. Importa el repositorio en Vercel (detecta Vite automáticamente).
2. Añade las variables de entorno de la tabla.
3. Despliega. La función `api/submit.ts` se publica sola.

## Scripts

| Comando | Acción |
|---|---|
| `npm run dev` | Servidor de desarrollo con API local |
| `npm run build` | Typecheck + build de producción |
| `npm run typecheck` | Solo TypeScript |
| `npm run lint` | ESLint |

## Robustez

- La validación con Zod se comparte entre el cliente y el servidor ([`shared/schema.ts`](shared/schema.ts)). La respuesta de la IA se valida en ambos lados.
- Groq responde con un esquema JSON estricto (`json_schema`). Si devuelve algo inválido, se reintenta una vez.
- Hay *rate limit* por IP, límite de tamaño del cuerpo, honeypot anti-bots y control de origen opcional.
- Para evitar envíos duplicados: bloqueo en el cliente, `submissionId` idempotente y deduplicación en Apps Script.
- El análisis de IA nunca llega al navegador: solo se guarda en Google Sheets.
- Las respuestas se conservan en `sessionStorage`, que se borra al cerrar la pestaña.
