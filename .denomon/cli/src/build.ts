import * as Denomon from './denomon/index.ts'
import { denoPath } from './system/deno-path.ts'

const WORKSPACE_DIR = Denomon.Env.get('WORKSPACE_DIR')
const ARTIFACTS_DIR = Denomon.Env.get('ARTIFACTS_DIR')

/**
 * Build command.
 *
 * This is identical to dev, find a name to unify both.
 */
export async function build(dir: string) {
  const src = WORKSPACE_DIR + '/dist' + `/${dir}`
  const dst = ARTIFACTS_DIR + `/${dir}`

  const { readPackageKit, findKit } = Denomon.Kits

  const kit_name = await readPackageKit(dir)
  const kit = await findKit(kit_name)

  Denomon.Env.set('SRC', src)
  Denomon.Env.set('OUT', dst)

  const deno = await denoPath()

  if (!deno) {
    throw new Error('Deno not found')
  }

  const build = new Deno.Command(deno, {
    args: ['run', '-A', kit + '/build.ts'],
    env: { ...Deno.env.toObject() },
  })

  await build.output().then(({ stdout, stderr, success }) => {
    const dcdr = new TextDecoder()

    if (!success) {
      console.error(dcdr.decode(stderr))
      return
    }

    console.log(dcdr.decode(stdout))
  })
}
