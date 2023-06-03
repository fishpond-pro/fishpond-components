import {
  inputComputeInServer,
  model,
  writeModel,
} from '@polymita/signal-model'
import indexes from '@/models/indexes.json'



/**
 * Model DataSource
 * 
 */
export type DataSource = {
  id: number
  createdAt: Date
  modifiedAt: Date
  type: 0
  rss: RSS
} | {
  id: number
  createdAt: Date
  modifiedAt: Date
  type: 1
  rpa: RPA
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

  const ds = model<DataSource[]>(indexes.dataSource, () => ({
    orderBy: {
      modifiedAt: 'desc',
    },
    include: {
      rss: true,
      rpa: true
    }
  }))

  const writeSource = writeModel(ds, () => ({
  }))

  const addSource = inputComputeInServer(function * (arg: { name: string, link: string }) {
    yield writeSource.create({
      type: 0,
      rss: {
        create: {
          name: arg.name,
          href: arg.link
        }
      }
    })
  })

  return {
    ds,
    addSource
  }
}