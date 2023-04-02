import {
  prisma,
  state,
} from '@polymita/signal-model'
import indexes from '@/models/indexes.json'

/**
 * Model Source
 * 
 */
export type Source = {
  id: number
  platform: string
  createdAt: Date
  modifiedAt: Date
}

/**
 * Model Message
 * 
 */
export type Message = {
  id: number
  link: string
  title: string | null
  time: Date | null
  description: string | null
  type: string
  sourceId: number
  createdAt: Date
  modifiedAt: Date

  source?: Source
}

/**
 * Model Content
 * 
 */
export type Content = {
  id: number
  title: string
  description: string
  content: string
  messageId: number
  createdAt: Date
  modifiedAt: Date

  message?: Message
}

export default function message () {

  const messages = prisma<Message[]>(indexes.message, () => ({
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      source: true
    }
  }))

  return {
    messages,
  }
}
