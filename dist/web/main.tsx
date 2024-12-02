// @deno-types="@types/react"
import { StrictMode } from 'react'
// @deno-types="@types/react-dom/client"
import { hydrateRoot } from 'react-dom/client'

import { Root, routes } from '@infinitydoc/website-pages'

import { createBrowserRouter, RouterProvider } from 'react-router'

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

const router = createBrowserRouter(routes)

function main() {
  hydrateRoot(
    document,
    <StrictMode>
      <Root title={globalThis.__HEAD__.title}>
        <RouterProvider router={router} />
      </Root>
    </StrictMode>,
  )
}
main()
