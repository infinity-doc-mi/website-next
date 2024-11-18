import * as Denomon from './denomon/index.ts'
import { denoPath } from './system/deno-path.ts'

const WORKSPACE_DIR = Denomon.Env.get('WORKSPACE_DIR')
const ARTIFACTS_DIR = Denomon.Env.get('ARTIFACTS_DIR')
const ENVS_DIR = Denomon.Env.get('ENVS_DIR')

type DevelopOptions = {
  env?: string
}

/**
 * Develop command.
 *
 * @todo add a way to indicate the env file to use
 */
export async function develop(opts: DevelopOptions, dir: string) {
  const src = WORKSPACE_DIR + '/dist' + `/${dir}`
  const dst = ARTIFACTS_DIR + `/${dir}`
  const env = ENVS_DIR + `/${opts.env}`

  const { readPackageKit, findKit } = Denomon.Kits

  const kit_name = await readPackageKit(dir)
  const kit = await findKit(kit_name)

  Denomon.Env.set('SRC', src)
  Denomon.Env.set('OUT', dst)
  Denomon.Env.set('ENV', env)

  const deno = await denoPath()

  if (!deno) {
    throw new Error('Deno not found')
  }

  const dev = new Deno.Command(deno, {
    args: ['run', '-A', kit + '/dev.ts'],
    env: { ...Deno.env.toObject() },
  })

  const chld = dev.spawn()

  await chld.output().catch(console.error)
}
