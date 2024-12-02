import type { QueryFactory } from '@duesabati/collection'

export class ServiceHighlight {
  [key: string]: any

  name: string = ''

  display_name: string = ''
  description: string = ''

  icon_url: string = ''

  location: string = ''

  constructor(info: Partial<ServiceHighlight> = {}) {
    Object.assign(this, info)
  }

  static all: QueryFactory<{}, ServiceHighlight> = (q) => q
}
