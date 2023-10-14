declare module '*.less'
declare module '*.css'



/**
 * Model Source
 * 
 */
type ChannelRecord = {
  id: number
  platform: string
  createdAt: Date
  modifiedAt: Date
}

declare enum MessageState {
  Unread = 0,
  Read = 1,
  Starred = 2,
}

/**
 * Model Message
 * 
 */
type MessageItem = {
  id: number
  link: string
  title: string | null
  time: Date | null
  description: string | null
  type: string
  channelRecordId: number
  createdAt: Date
  modifiedAt: Date

  channelRecord?: ChannelRecord
  state?: MessageState;
}