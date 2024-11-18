// @deno-types="@types/react"
import { useMemo } from 'react'

import { sequence } from '@duesabati/misc'
import * as Icons from '@infinitydoc/icons'

export function GoogleRating(ps: { value: number }) {
  const stars = useMemo(
    () =>
      sequence(5).map((n) => (
        n <= Math.ceil(ps.value)
          ? <Star className='size-6' key={n} />
          : <Star className='size-6 opacity-30' key={n} />
      )),
    [],
  )

  return (
    <div className='px-7 py-3 rounded-2xl shadow-md bg-white'>
      <div className='flex items-center gap-5'>
        <Icons.Google.G_Logo className='size-12' />

        <div className='flex flex-col gap-1'>
          <span className='font-semibold text-[#6A6A6A] text-lg'>
            Google Rating
          </span>

          <div className='flex items-center gap-4'>
            <span className='font-bold text-[#FEA500] text-xl'>{ps.value}</span>
            <div className='flex items-center gap-1'>{stars}</div>
          </div>

          <p className='text-[#6A6A6A]/60'>
            See our reviews
          </p>
        </div>
      </div>
    </div>
  )
}

const Star = (ps: Icons.IconProps) => (
  <svg
    width='50'
    height='48'
    viewBox='0 0 50 48'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...ps}
  >
    <path
      d='M23.2089 1.60489C23.9443 0.124775 26.0557 0.124779 26.7911 1.60489L32.7971 13.6929C33.0883 14.279 33.6479 14.6856 34.2953 14.7814L47.6477 16.7581C49.2826 17.0001 49.935 19.0082 48.7546 20.1649L39.1142 29.6124C38.6467 30.0705 38.433 30.7283 38.5419 31.3736L40.7881 44.6833C41.0632 46.313 39.355 47.554 37.8901 46.7888L25.926 40.5397C25.3458 40.2366 24.6542 40.2366 24.074 40.5396L12.11 46.7888C10.645 47.554 8.93684 46.313 9.21188 44.6833L11.4581 31.3736C11.567 30.7283 11.3533 30.0705 10.8858 29.6124L1.24539 20.1649C0.0649679 19.0081 0.717431 17.0001 2.35235 16.7581L15.7047 14.7814C16.3521 14.6856 16.9117 14.279 17.2029 13.6929L23.2089 1.60489Z'
      fill='#FEA500'
    />
  </svg>
)
