import { default as esbuild } from 'esbuild'
import { denoPlugins } from 'esbuild-deno-plugin'

const WORKSPACE_DIR = Deno.env.get('DENOMON_WORKSPACE_DIR') || 'unset'

const SRC_DIR = Deno.env.get('DENOMON_SRC') || 'unset'
const OUT_DIR = Deno.env.get('DENOMON_OUT') || 'unset'

const ENTRYPOINT_FILE = 'main.ts'

const as_js = (filename: string) => filename.replace(/\.ts$/, '.js')

const env = Object.fromEntries(
  Object.entries(Deno.env.toObject())
    .map(([k, v]) => [`process.env.${k}`, JSON.stringify(v)]),
)

async function main() {
  console.time('Built in')

  const build = await esbuild.build({
    entryPoints: [`${SRC_DIR}/${ENTRYPOINT_FILE}`],
    outdir: OUT_DIR,
    bundle: true,
    minify: true,
    keepNames: true,
    sourcemap: false,
    jsx: 'automatic',
    format: 'esm',
    metafile: true,
    plugins: [...denoPlugins({ configPath: `${WORKSPACE_DIR}/deno.jsonc` })],
    define: {
      'process.env.NODE_ENV': '"production"',
      ...env,
    },
  })

  console.timeEnd('Built in')

  if (build.metafile) {
    await Deno.writeTextFile(
      `${OUT_DIR}/.meta.json`,
      JSON.stringify(build.metafile),
    )
  }

  const { size } = await Deno.stat(`${OUT_DIR}/${as_js(ENTRYPOINT_FILE)}`)
  // Log the size in kilobytes
  console.log(`Built size: ${Math.round(size / 1024)} KB`)

  return
}

await main()
