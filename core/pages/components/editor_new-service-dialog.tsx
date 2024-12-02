// @deno-types="@types/react"
import { useState } from 'react'

import { Button, EditorDialog } from '@infinitydoc/theme'

export function NewServiceDialog() {
  const [is_open, set_open] = useState(false)

  const open = () => set_open(true)
  const close = () => set_open(false)

  return (
    <>
      <Button onClick={open}>
        Add Service
      </Button>
      <EditorDialog
        open={is_open}
        onClose={close}
        onSave={() => {}}
      />
    </>
  )
}
