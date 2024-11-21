import type { IconProps } from '../types/index.ts'

export function ChevronDown(ps: IconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='32'
      height='32'
      viewBox='0 0 24 24'
      fill='none'
      strokeWidth='1.5'
      {...ps}
    >
      <path
        stroke='currentColor'
        d='M19.92 8.95l-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95'
      >
      </path>
    </svg>
  )
}
