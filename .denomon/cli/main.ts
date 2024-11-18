import { Command } from 'cliffy'
import { develop } from './src/dev.ts'
import { build } from './src/build.ts'

await new Command()
  .name('Denomon CLI')
  .description('A clear and simple CLI for the Denomon monorepo setup.')
  .version('0.0.1')
  .usage('denomon <command> [options]')
  /** Develop */
  .command(
    'develop',
    'Execute the develop command of the dev-kit associated with the dist project.',
  )
  .alias('dev')
  .arguments('<project:string>')
  .option(
    '-e, --env <env:string>',
    'The env directory from which the kit will collect env vars.',
    { default: 'development' },
  )
  .action(develop)
  /** Build */
  .command(
    'build',
    'Execute the build command of the dev-kit associated with the dist project.',
  )
  .arguments('<project:string>')
  .action(async (_, args) => await build(args))
  .parse(Deno.args)
