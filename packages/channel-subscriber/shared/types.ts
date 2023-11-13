export interface SubscribedChannel{
  id: number
  createdAt: Date
  modifiedAt: Date
  type: number
  channel: string | null
  rss?: {
    id: number
    createdAt: Date
    modifiedAt: Date
    name: string
    href: string
    scheduleCron: string | null  
  }[]
}