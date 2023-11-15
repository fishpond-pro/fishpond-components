/**
 * Model DataSource
 * 
 */
export type SubscribedChannel = {
  id: number
  createdAt: Date
  modifiedAt: Date
  type: 0
  channel: string
  rss: RSS[]
} 

export interface SubscribedChannelWithForm extends SubscribedChannel {
  rss: RSSWithForm[]
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

export interface RSSWithForm extends RSS {
  path: string
  payload: Record<string, any>
}

export type RPA = {
  id: number
  createdAt: Date
  modifiedAt: Date
  name: string
  dataSourceId: number | null
}