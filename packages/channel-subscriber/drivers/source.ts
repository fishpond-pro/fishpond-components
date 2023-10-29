import {
  inputComputeInServer,
  model,
  prisma,
  signal,
  writeModel,
  writePrisma,
} from '@polymita/signal-model'
import indexes from '@/models/indexes.json'
import { parseRSSUrl } from '@/shared/utils'

/**
 * Model DataSource
 * 
 */
export type DataSource = {
  id: number
  createdAt: Date
  modifiedAt: Date
  type: 0
  channel: string
  rss: RSS[]
} | {
  id: number
  createdAt: Date
  modifiedAt: Date
  channel: string
  type: 1
  rpa: RPA[]
}
export type RSS = {
  id: number
  createdAt: Date
  modifiedAt: Date
  name: string
  href: string
  scheduleCron: string | null
  dataSourceId: number | null
}
export type RPA = {
  id: number
  createdAt: Date
  modifiedAt: Date
  name: string
  dataSourceId: number | null
}

export default function source () {

  const ds = prisma<DataSource[]>(indexes.subscribedChannel, () => ({
    orderBy: {
      modifiedAt: 'desc',
    },
    include: {
      rss: true,
      rpa: true
    }
  }))

  const dsWithForm = signal(() => {
    const source = ds()
    return source.map(s => {
      if (s.type === 0) {
        return {
          ...s,
          rss: s.rss.map(r => {
            const { path, payload } = parseRSSUrl(r.href)
            return {
              ...r,
              path,
              payload,
            }
          })
        }
      }
      return s;
    })
  })

  const writeSource = writePrisma(ds, () => ({
  }))

  const addSource = inputComputeInServer(function * (arg: {
    name: string, link: string,
    platform: string,
  }) {
    yield writeSource.upsert({
      type: 0,
      channel: arg.platform,
      rss: {
        create: {
          name: arg.name,
          href: arg.link,
        }
      }
    })
  })

  return {
    ds,
    dsWithForm,
    addSource
  }
}