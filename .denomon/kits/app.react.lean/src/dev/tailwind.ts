import { default as esbuild } from 'esbuild'
import { denoPlugins } from 'esbuild-deno-plugin'

import postcss from 'postcss'
import tailwind, { type Config } from 'tailwindcss'

const WORKSPACE_DIR = Deno.env.get('DENOMON_WORKSPACE_DIR') || 'unset'
const SRC_DIR = Deno.env.get('DENOMON_SRC') || 'unset'
const OUT_DIR = Deno.env.get('DENOMON_OUT') || 'unset'

const build = async (entry_point: string, configPath: string) =>
  await esbuild.build({
    write: false,
    format: 'esm',
    plugins: [...denoPlugins({ configPath })],
    entryPoints: [entry_point],
    bundle: true,
  })

export async function buildCSS() {
  const kit_config = new URL(import.meta.resolve('../../deno.json')).pathname

  const { outputFiles } = await build(
    `${SRC_DIR}/tailwind.config.js`,
    kit_config,
  )

  if (outputFiles == null || outputFiles.length === 0) {
    console.error('Failed to build tailwind config')
    return
  }

  const output = outputFiles[0]
  const data_url = `data:application/javascript;base64,${btoa(output.text)}`
  const config = await import(data_url) as { default: Config }

  const proc = postcss([tailwind({
    ...config.default,
    content: [
      `${WORKSPACE_DIR}/**/*.{html,js,jsx,ts,tsx}`,
      `!${WORKSPACE_DIR}/node_modules/**/*`,
      `!${WORKSPACE_DIR}/.denomon/**/*`,
      `!${WORKSPACE_DIR}/.devcontainer/**/*`,
      `!${WORKSPACE_DIR}/tests/**/*`,
      `!${WORKSPACE_DIR}/ship/**/*`,
    ],
  })])

  const css = await Deno.readTextFile(`${SRC_DIR}/index.css`)

  return proc.process(css, {
    from: `${SRC_DIR}/index.css`,
    to: `${OUT_DIR}/index.css`,
    map: true,
  }).then((res) => {
    if (res.map) {
      Deno.writeTextFile(`${OUT_DIR}/index.css.map`, res.map.toString())
    }

    Deno.writeTextFile(`${OUT_DIR}/index.css`, res.css)
  })
}
