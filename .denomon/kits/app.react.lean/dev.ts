import { debounce } from '@std/async/debounce'
import { serveDir } from '@std/http/file-server'

import { buildCSS } from './src/dev/tailwind.ts'
import { buildJS } from './src/dev/esbuild.ts'
import { buildStatic } from './src/shared/static.ts'
import { removeAsset } from './src/shared/static.ts'

const SRC_DIR = Deno.env.get('DENOMON_SRC') || 'unset'
const OUT_DIR = Deno.env.get('DENOMON_OUT') || 'unset'

const PORT = Deno.env.get('PORT') ?? 1234

const clients = new Set<
  ReadableStreamDefaultController<Uint8Array>
>()
const encoder = new TextEncoder()

const debounced = debounce(async (e: Deno.FsEvent) => {
  console.time('Rebuilt in')
  if (e.paths.some(isSourceCode)) {
    await Promise.all([buildJS(), buildCSS()])
  }

  if (e.paths.some(isHtml) || e.paths.some(isCss)) {
    await buildCSS()
  }

  if (e.kind === 'remove') {
    await removeAsset(e.paths[0].replace(SRC_DIR, OUT_DIR))
  }
  console.timeEnd('Rebuilt in')

  for (const client of Array.from(clients)) {
    client.enqueue(encoder.encode('data: reload\n\n'))
  }
}, 300)

const only_source = (path: string) => {
  return !path.includes('.cache') && !path.includes('http://') &&
    !path.includes('https://')
}

async function main(): Promise<void> {
  console.log(`Starting development...`)
  console.time('Built in')
  const [build] = await Promise.all([buildJS(), buildCSS(), buildStatic()])
  console.timeEnd('Built in')

  const source_imports = Object.keys(build.metafile.inputs).filter(only_source)

  Deno.writeTextFile(`${OUT_DIR}/.meta.json`, JSON.stringify(build.metafile))

  const watcher = Deno.watchFs([SRC_DIR, ...source_imports])

  Deno.serve({ port: Number(PORT), hostname: '0.0.0.0' }, async (req) => {
    const url = new URL(req.url)

    if (url.pathname === '/live-reload') {
      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          clients.add(controller)

          controller.enqueue(encoder.encode('data: connected\n\n'))

          let closed = false

          const close = () => {
            if (closed) return

            closed = true
            clients.delete(controller)
            req.signal.removeEventListener('abort', close)
            controller.close()
          }

          req.signal.addEventListener('abort', close)

          if (req.signal.aborted) {
            return close()
          }
        },
      })

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    const asset = await serveDir(req, { fsRoot: `${OUT_DIR}/`, quiet: true })

    if (asset.status === 404) {
      const index = await Deno.readTextFile(`${OUT_DIR}/index.html`)

      return new Response(index, {
        headers: {
          'Content-Type': 'text/html',
        },
      })
    }

    return asset
  })

  for await (const event of watcher) {
    debounced(event)
  }
}

const SOURCECODE_EXTS = ['.ts', '.tsx', '.js', '.jsx']

const isSourceCode = (path: string) =>
  SOURCECODE_EXTS.some((ext) => path.endsWith(ext))

const isHtml = (path: string) => path.endsWith('.html')

const isCss = (path: string) => path.endsWith('.css')

await main().catch(console.error)
