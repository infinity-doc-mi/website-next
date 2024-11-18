const SRC_DIR = Deno.env.get('DENOMON_SRC') || 'unset'

function main() {
  const cmd = new Deno.Command(Deno.execPath(), {
    args: ['serve', '-A', '--watch', SRC_DIR + '/main.ts', '--port', '8000'],
  })

  cmd.spawn()
}

main()
