import postcss from 'postcss'
import tailwind, { type Config } from 'tailwindcss'

const WORKSPACE_DIR = Deno.env.get('DENOMON_WORKSPACE_DIR') || 'unset'
const SRC_DIR = Deno.env.get('DENOMON_SRC') || 'unset'
const OUT_DIR = Deno.env.get('DENOMON_OUT') || 'unset'

export async function buildCSS() {
  const config = await import(`${SRC_DIR}/tailwind.config.js`) as {
    default: Config
  }

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