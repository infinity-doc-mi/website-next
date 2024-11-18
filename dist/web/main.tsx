import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'

import { Root, routes } from '@infinitydoc/website-pages'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

if (!globalThis._IS_PRODUCTION_) {
  console.log('Live reload enabled!')
  const src = new EventSource('/live-reload')
  src.addEventListener('message', (e) => {
    if (e.data === 'reload') {
      src.close()
      location.reload()
    }
  })

  src.addEventListener('open', () => {
    console.log('Live reload connected!')
  })
}

const router = createBrowserRouter(routes, {
  future: {
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_relativeSplatPath: true,
    v7_skipActionErrorRevalidation: true,
  },
})

const main = () =>
  hydrateRoot(
    document,
    <StrictMode>
      <Root title={globalThis.__HEAD__.title}>
        <RouterProvider router={router} future={{ v7_startTransition: true }} />
      </Root>
    </StrictMode>,
  )

main()
