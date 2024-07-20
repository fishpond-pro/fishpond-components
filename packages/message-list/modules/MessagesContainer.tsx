import { h, SignalProps, PropTypes, useLogic, ConvertToLayoutTreeDraft, VirtualLayoutJSON, createFunctionComponent } from '@polymita/renderer';
import '@polymita/renderer/jsx-runtime';
import { useState } from 'react';
import * as SingleTimelineModule from './SingleTimeline'
import * as MessageContentModule from './MessageContent'
import { prisma } from '@polymita/next-connect';
import indexes from '@/models/indexes.json'

export const name = 'MessagesContainer' as const
export const namespace = 'components' as const
export let meta: {
  props: MessagesContainerProps,
  layoutStruct: MessagesContainerLayout
  patchCommands: []
}

export interface MessagesContainerProps {
  mid: string | number
  mode: MessageContentModule.MessageContentProps['mode']
}

export const propTypes = {
}

export const logic = (props: MessagesContainerProps) => {
  const [currentMid, setMid] = useState(Number(props.mid))

  const [params, setParams] = useState<{ messageId: number,channelRecordId: number, size: number }>({
    messageId: undefined,
    channelRecordId: undefined,
    size: 50,
  })

  const messages = prisma<MessageItem[]>(indexes.message, () => {
    const payload = params;

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

  const queryMessageAll = () => {

  }

  const selectMessage = (item: MessageItem) => {
    setMid(item.id)
  }

  const currentMessage = messages?.find(m => m.id === currentMid)

  return {
    messages,
    setMid,
    currentMid,
    queryMessageAll,
    selectMessage,
    currentMessage,
  }
}
type LogicReturn = ReturnType<typeof logic>

const SingleTimeline = createFunctionComponent(SingleTimelineModule)
const MessageContent = createFunctionComponent(MessageContentModule)

export type MessagesContainerLayout = {
  type: 'messagesContainer',
  children: [
  ]
}
export const layout = (props: MessagesContainerProps): VirtualLayoutJSON => {
  const { mode } = props
  const { 
    selectMessage,
    currentMessage,
    messages, currentMid, setMid, queryMessageAll 
  } = useLogic<LogicReturn>()
  return (
    <messagesContainer className='flex h-full'>
      <messagesContainerTimeline className='main mr-4 w-[300px]'>

        <SingleTimeline 
          messages={messages} 
          onClick={item => {
            selectMessage(item)
          }}
        />
      </messagesContainerTimeline>
      <messagesContainerContent className='flex-1 border-l p-4 h-full min-h-0'>
        {currentMessage && (
          <MessageContent
            mode={mode}
            displayType='normal'
            title={currentMessage.title}
            description={currentMessage.description}
            contentLink={currentMessage.link}
          />
        )}
      </messagesContainerContent>
    </messagesContainer>
  )
}

export const styleRules = (props: MessagesContainerProps, layout: ConvertToLayoutTreeDraft<MessagesContainerLayout>) => {
  return [
  ]
}

export const designPattern = (props: MessagesContainerProps, layout: ConvertToLayoutTreeDraft<MessagesContainerLayout>) => {
  const logic = useLogic<LogicReturn>()
  return {}
}
