export type SubscribedChannel = {
  id: number
  createdAt: Date
  modifiedAt: Date
  type: number
  platform: string | null
}
export type RSS = {
  id: number
  createdAt: Date
  modifiedAt: Date
  name: string
  href: string
  scheduleCron: string | null
  subscribedChannelId: number | null
}
export type RPA = {
  id: number
  createdAt: Date
  modifiedAt: Date
  name: string
  subscribedChannelId: number | null
}