import { watchJS } from './src/esbuild.ts'

const OUT_DIR = Deno.env.get('DENOMON_OUT') || 'unset'
const WORKSPACE_DIR = Deno.env.get('DENOMON_WORKSPACE_DIR') || 'unset'
const ENVS_DIR = Deno.env.get('DENOMON_ENV') || 'unset'

const IMAGE_NAME = 'wragler'

const decoder = new TextDecoder()

async function main() {
  const script_path = `${OUT_DIR}/main.js`

  globalThis.addEventListener('unload', () => {
    console.log('Cleaning up...')
    remove_wrangler_container()
  })

  watchJS()
  await wrangler(script_path)
}

await main()

async function wrangler(script_path: string) {
  const image_id = await find_wrangler_image()

  if (!image_id) {
    console.log('Wrangler image not found. Building...')
    await build_wragler()
  }

  const cmd = new Deno.Command('docker', {
    args: [
      'run',
      '--rm',
      '-v',
      `${WORKSPACE_DIR}:${WORKSPACE_DIR}`,
      '-p',
      '8787:8787',
      IMAGE_NAME,
      '--ip',
      '0.0.0.0',
      '--live-reload',
      '--no-bundle',
      '--compatibility-date',
      '2024-11-18',
      '--config',
      `${ENVS_DIR}/wrangler.toml`,
      script_path,
    ],
  })

  return cmd.spawn()
}

async function build_wragler() {
  const cmd = new Deno.Command('docker', {
    args: [
      'build',
      '-t',
      IMAGE_NAME,
      '-f',
      '.denomon/kits/app.cloudflare.worker/wrangler/Dockerfile',
      `${WORKSPACE_DIR}`,
    ],
  })

  const { success, stderr } = await cmd.output()

  if (!success) {
    console.error('Failed to build wrangler. Error:')
    console.error(decoder.decode(stderr))
    Deno.exit(1)
  }

  console.log('Built wrangler')
  return
}

async function find_wrangler_image() {
  const cmd = new Deno.Command('docker', { args: ['images', '-q', IMAGE_NAME] })
  const { stdout } = await cmd.output()

  const image_id = decoder.decode(stdout).trim()

  return image_id === '' ? undefined : image_id
}

async function remove_wrangler_container() {
  const cmd = new Deno.Command('docker', { args: ['rm', '-f', IMAGE_NAME] })
  await cmd.output()
  return
}
