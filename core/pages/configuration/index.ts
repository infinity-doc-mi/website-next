import { Collection, CollectionMap } from '@duesabati/collection'

import { web_server } from '@duesabati/collection-http'

import { ServiceHighlight } from '@infinitydoc/model'

// import { create } from 'zustand'

// export type InfinitydocState = {
//   cols: ReactiveCollectionMap
// }

// // export type InfinitydocStore = StoreApi<InfinitydocState>

// const cols = new CollectionMap()
//   .set(ServiceHighlight, Collection.of(ServiceHighlight))

// export function configure_store(cfg: {
//   reactive: Reactive
//   setup_collection: (col: CollectionMap) => void
// }) {
//   cfg.setup_collection(cols)
//   const r_cols = ReactiveCollectionMap.from_collection_map(cols, cfg.reactive)

//   return create<InfinitydocState>(() => ({ cols: r_cols }))
// }

export const client_cols = new CollectionMap().set(
  ServiceHighlight,
  Collection.of(ServiceHighlight).store_in(
    web_server('/db/service_highlights'),
  ),
)
