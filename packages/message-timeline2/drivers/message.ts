import {
  prisma,
  state,
} from '@polymita/signal-model'
import indexes from '@/models/indexes.json'

/**
 * Model Source
 * 
 */
export type ChannelRecord = {
  id: number
  platform: string
  createdAt: Date
  modifiedAt: Date
}

/**
 * Model Message
 * 
 */
export type MessageItem = {
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
}

/**
 * Model Content
 * 
 */
export type MessageContent = {
  id: number
  title: string
  description: string
  content: string
  messageId: number
  createdAt: Date
  modifiedAt: Date

  message?: MessageItem
}

export default function message () {

  const messages = prisma<MessageItem[]>(indexes.message, () => ({
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      channelRecord: true
    }
  }))

  return {
    messages,
  }
}
