import type { Carrier } from './carrier.ts'

export interface Transcriber<T = unknown> {
  (i: Carrier, o: Carrier): void
}
