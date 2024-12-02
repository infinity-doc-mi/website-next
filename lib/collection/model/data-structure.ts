export interface DataStructure {
  [key: string]:
    | string
    | number
    | boolean
    | null
    | undefined
    | DataStructure
    | Array<string | number | boolean | null | undefined | DataStructure>
}

export type StorableData =
  | string
  | number
  | boolean
  | null
  | undefined
  | DataStructure
  | Array<string | number | boolean | null | undefined | DataStructure>
