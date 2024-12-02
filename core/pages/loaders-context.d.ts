import type { CollectionMap } from '@duesabati/collection'

declare module 'react-router' {
  interface LoaderFunctionArgs {
    context: { cols: CollectionMap }
  }
}
