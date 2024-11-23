import type { IconProps } from '../types/index.ts'

export function ChevronRight(ps: IconProps) {
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
        d='M8.91 19.92l6.52-6.52c.77-.77.77-2.03 0-2.8L8.91 4.08'
      >
      </path>
    </svg>
  )
}
