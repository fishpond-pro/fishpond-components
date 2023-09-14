import {
  inputComputeInServer,
  prisma,
  signal,
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

  const params = signal<{ messageId: number,channelRecordId: number }>({
    messageId: undefined,
    channelRecordId: undefined,
  })

  const messages = prisma<MessageItem[]>(indexes.message, () => {
    const payload = params()

    return {
      orderBy: {
        createdAt: 'desc'
      },
      where: {
        id: payload.messageId,
        channelRecordId: payload.channelRecordId
      },
      include: {
        channelRecord: true,
      }
    }
  })

  const queryMessageByChannelRecord = inputComputeInServer(function * (id: number) {
    params(draft => {
      Object.assign(draft, {
        messageId: undefined,
        channelRecordId: id,
      });
    })
  })
  const queryMessageByMessageId = inputComputeInServer(function * (id: number) {
    params(draft => {
      Object.assign(draft, {
        messageId: id,
        channelRecordId: undefined,
      });
    })
  })

  const queryMessageAll = inputComputeInServer(function * () {
    params(draft => {
      Object.assign(draft, {
        messageId: undefined,
        channelRecordId: undefined,
      });
    })
  })

  return {
    queryMessageByChannelRecord,
    queryMessageByMessageId,
    queryMessageAll,
    messages,
  }
}
