import {
  prisma,
  state,
} from '@polymita/signal-model'
import indexes from '@/models/indexes.json'

export interface Message {
  id: number
  link: string
  title: string | null
  time: Date | null
  description: string | null
  type: string
  sourceId: number
  createdAt: Date
  modifiedAt: Date
}

export default function message () {

  const messages = prisma<Message[]>(indexes.message, () => ({
    orderBy: {
      createdAt: 'desc'
    }
  }))

  return {
    messages,
  }
}
