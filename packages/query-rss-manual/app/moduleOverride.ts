import { getConfig } from '@polymita/next-connect'

export const modulesLinkMap = getConfig().moduleOverride?.linkMap

export const modulesActiveMap = [
  ...(getConfig().moduleOverride?.activeLink || []),
  'components-AsideNew'
]