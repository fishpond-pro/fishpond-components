import { prisma } from '@polymita/next-connect'
import indexes from '../models/indexes.json'
import { useMemo, useState } from 'react'

/**
 * Model Content
 * iuhiu
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

  const [params, setParams] = useState<{ messageId: number,channelRecordId: number, size: number }>({
    messageId: undefined,
    channelRecordId: undefined,
    size: 50,
  })

  const messages = prisma<MessageItem[]>(indexes.message, () => {
    const payload = params

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

  const queryMessageByChannelRecord = (id: number) => {
    setParams(draft => {
      return Object.assign({}, draft, {
        messageId: undefined,
        channelRecordId: id,
      });
    })
  }
  const queryMessageByMessageId = (id: number) => {
    setParams(draft => {
      return Object.assign({}, draft, {
        messageId: id,
        channelRecordId: undefined,
      });
    })
  }

  const queryMessageAll = () => {
    setParams(draft => {
      return Object.assign({}, draft, {
        messageId: undefined,
        channelRecordId: undefined,
      });
    })
  }

  const [currentMessageItemId, setCurrentMessageItemId] = useState<number>(null);

  const currentMessageItem = useMemo<MessageItem | null>(() => {
    const id = currentMessageItemId;
    return id ? messages.find((item) => {
      return item.id === id;
    }) : null;
  }, [currentMessageItemId, messages]);

  const selectMessage = (mc: MessageItem) => {
    setCurrentMessageItemId(() => {
      return mc.id;
    })
  }

  return {
    queryMessageByChannelRecord,
    queryMessageByMessageId,
    queryMessageAll,
    selectMessage,
    currentMessageItem,
    messages,
  }
}
