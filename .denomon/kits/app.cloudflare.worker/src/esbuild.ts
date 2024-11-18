import { default as esbuild } from 'esbuild'
import { denoPlugins } from 'esbuild-deno-plugin'

const WORKSPACE_DIR = Deno.env.get('DENOMON_WORKSPACE_DIR') || 'unset'

const SRC_DIR = Deno.env.get('DENOMON_SRC') || 'unset'
const OUT_DIR = Deno.env.get('DENOMON_OUT') || 'unset'

const env = Object.fromEntries(
  Object.entries(Deno.env.toObject()).filter(([k]) => k.startsWith('WRANGLER_'))
    .map(([k, v]) => [k.slice(4), v])
    .map(([k, v]) => [`process.env.${k}`, JSON.stringify(v)]),
)

const ctx = await esbuild.context({
  entryPoints: [`${SRC_DIR}/main.ts`],
  outdir: OUT_DIR,
  bundle: true,
  jsx: 'automatic',
  minify: false,
  keepNames: true,
  sourcemap: true,
  format: 'esm',
  metafile: true,
  plugins: [
    ...denoPlugins({ configPath: `${WORKSPACE_DIR}/deno.jsonc` }),
  ],
  define: {
    'process.env.NODE_ENV': '"development"',
    ...env,
  },
})

export const watchJS = ctx.watch
