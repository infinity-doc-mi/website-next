import { Collection, CollectionMap } from '@duesabati/collection'

import { ServiceHighlight } from '@infinitydoc/model'

const cols = new CollectionMap().set(
  ServiceHighlight,
  Collection.of(ServiceHighlight),
)

export const setup_cols = (configure: (cols: CollectionMap) => void) => {
  configure(cols)

  return cols
}
