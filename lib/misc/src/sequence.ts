/**
 * Generate an array of numbers given the desired length
 *
 * @param of Number of elements for the desired array
 * @returns An array of numbers from 1 to the value of `of`
 * @example
 * 
 * const range = sequence(5)
 * console.log(range) // [1, 2, 3, 4, 5]
 */
export const sequence = (of: number) => {
  return Array.from({ length: of }).map((_, i) => i + 1)
}
