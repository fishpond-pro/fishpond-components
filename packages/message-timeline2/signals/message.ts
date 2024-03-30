import {
  inputCompute,
  inputComputeInServer,
  prisma,
  signal,
  state,
} from '@polymita/signal-model'
import indexes from '@/models/indexes.json'

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

  const params = signal<{ messageId: number,channelRecordId: number, size: number }>({
    messageId: undefined,
    channelRecordId: undefined,
    size: 50,
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
      take: payload.size,
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

  const currentMessageItemId = signal<number>(null);

  const currentMessageItem = signal<MessageItem | null>(() => {
    const id = currentMessageItemId();
    return id ? messages().find((item) => {
      return item.id === id;
    }) : null;
  });

  const selectMessage = inputCompute((mc: MessageItem) => {
    currentMessageItemId(() => {
      return mc.id;
    })
  })

  return {
    queryMessageByChannelRecord,
    queryMessageByMessageId,
    queryMessageAll,
    selectMessage,
    currentMessageItem,
    messages,
  }
}
