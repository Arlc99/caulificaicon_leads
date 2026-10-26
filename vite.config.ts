import { defineConfig, loadEnv, type Plugin, type ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { IncomingMessage, ServerResponse } from 'node:http'

type Handler = (request: Request, env: Record<string, string | undefined>) => Promise<Response>

/**
 * Sirve las funciones serverless de /api en desarrollo con la misma lógica
 * que se despliega en Vercel (server/handlers.ts). Las claves solo viven aquí.
 */
function devApi(env: Record<string, string>): Plugin {
  return {
    name: 'dev-api',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/api', (req, res, next) => {
        void handle(server, env, req, res).catch(next)
      })
    },
  }
}

async function handle(
  server: ViteDevServer,
  env: Record<string, string>,
  req: IncomingMessage,
  res: ServerResponse,
) {
  const mod = (await server.ssrLoadModule('/server/handlers.ts')) as Record<string, Handler>
  const routes: Record<string, Handler | undefined> = {
    '/submit': mod.handleSubmit,
  }
  const path = (req.url ?? '/').split('?')[0] ?? '/'
  const route = routes[path]
  if (!route) {
    res.statusCode = 404
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify({ error: { code: 'not_found', message: 'Ruta no encontrada.' } }))
    return
  }

  const chunks: Buffer[] = []
  for await (const chunk of req) chunks.push(chunk as Buffer)
  const headers = new Headers()
  for (const [key, value] of Object.entries(req.headers)) {
    if (typeof value === 'string') headers.set(key, value)
  }
  const hasBody = req.method !== 'GET' && req.method !== 'HEAD'
  const request = new Request(`http://${req.headers.host ?? 'localhost'}/api${req.url ?? ''}`, {
    method: req.method,
    headers,
    body: hasBody ? Buffer.concat(chunks) : undefined,
  })

  const response = await route(request, { ...process.env, ...env })
  res.statusCode = response.status
  response.headers.forEach((value, key) => res.setHeader(key, value))
  res.end(Buffer.from(await response.arrayBuffer()))
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tailwindcss(), devApi(env)],
  }
})
