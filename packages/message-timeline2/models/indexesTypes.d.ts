export type ChannelRecord = {
  id: number
  channel: string
  lastUpdatedDate: Date
  fullContentPath: string | null
  createdAt: Date
  modifiedAt: Date
}
export type Message = {
  id: number
  link: string
  title: string | null
  time: Date | null
  description: string | null
  type: string
  channelRecordId: number
  state: number | null
  createdAt: Date
  modifiedAt: Date
}
export type MessageContent = {
  id: number
  title: string
  description: string
  content: string
  messageId: number
  createdAt: Date
  modifiedAt: Date
}