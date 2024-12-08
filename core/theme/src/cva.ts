import { defineConfig } from 'cva'
import { twMerge } from 'tailwind-merge'

export const { cva, cx, compose } = defineConfig({
  hooks: { 'cx:done': twMerge },
})

export type { VariantProps } from 'cva'
