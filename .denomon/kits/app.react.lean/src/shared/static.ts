import { copy, ensureDir, exists } from '@std/fs'

const SRC_DIR = Deno.env.get('DENOMON_SRC') || 'unset'
const OUT_DIR = Deno.env.get('DENOMON_OUT') || 'unset'

const PORT = Deno.env.get('PORT') ?? 1234
const BASE_URL = Deno.env.get('BASE_URL') || `http://localhost:${PORT}`
const APP_MAIN = `${BASE_URL}/main.js`

let outdir_ensured = false
let index_html_check_done = false
let has_index_html = false

export async function buildStatic() {
  if (!outdir_ensured) {
    await ensureDir(`${OUT_DIR}`)
    outdir_ensured = true
  }

  await copy(`${SRC_DIR}/static`, `${OUT_DIR}`, { overwrite: true })

  if (!index_html_check_done) {
    has_index_html = await exists(`${SRC_DIR}/static/index.html`)
    index_html_check_done = true
  }

  if (has_index_html) {
    const html = await Deno.readTextFile(`${SRC_DIR}/static/index.html`)
    const newHtml = html
      .replace(/__BASE__/g, BASE_URL)
      .replace(/__MAIN__/g, APP_MAIN)

    await Deno.writeTextFile(`${OUT_DIR}/index.html`, newHtml)
  }
}

export async function removeAsset(path: string) {
  if (await exists(path)) {
    await Deno.remove(path, { recursive: true })
  }
}

export async function cleanAssets() {
  await removeAsset(`${OUT_DIR}`)
}