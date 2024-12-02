import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react'
import { Button } from './button.tsx'

type EditorDialogProps = {
  open: boolean
  onClose(): void
  onSave(): void

  title?: React.ReactNode
  description?: React.ReactNode
  cancel_label?: React.ReactNode
  save_label?: React.ReactNode
}

export function EditorDialog(ps: EditorDialogProps) {
  const { title = 'title', description = 'description' } = ps

  return (
    <Dialog open={ps.open} onClose={ps.onClose} className='relative z-50'>
      <div className='fixed inset-0 flex w-screen items-center justify-center p-4'>
        <DialogPanel className='max-w-lg space-y-4 border bg-white p-12'>
          <DialogTitle className='font-bold'>{title}</DialogTitle>

          <Description>{description}</Description>
          <p>
            Are you sure you want to deactivate your account? All of your data
            will be permanently removed.
          </p>
          <div className='flex gap-4'>
            <Button variant='ghost' onClick={ps.onClose}>
              {ps.cancel_label}
            </Button>
            <Button onClick={ps.onSave}>{ps.save_label}</Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
