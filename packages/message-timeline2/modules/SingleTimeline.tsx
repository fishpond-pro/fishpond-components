import { h, SignalProps, PropTypes, useLogic, ConvertToLayoutTreeDraft, createFunctionComponent, VirtualLayoutJSON } from '@polymita/renderer';
import { after, Signal, signal } from '@polymita/signal'
import * as MessageModule from './Message'
import type { MessageItem } from '@/drivers/message';

export const name = 'SingleTimeline' as const
export let meta: {
  props: SingleTimelineProps,
  layoutStruct: SingleTimelineLayout
  patchCommands: []
}

export interface SingleTimelineProps {
  messages: Signal<MessageItem[]>
}

export const propTypes = {
}

export const logic = (props: SignalProps<SingleTimelineProps>) => {
  return {
  }
}
type LogicReturn = ReturnType<typeof logic>

export type SingleTimelineLayout = {
  type: 'singleTimeline',
  children: [
  ]
}

const Message = createFunctionComponent(MessageModule)

export const layout = (props: SingleTimelineProps): VirtualLayoutJSON => {
  const logic = useLogic<LogicReturn>()

  const messagesData = props.messages();

  return (
    <singleTimeline>
      {messagesData.map((message, index) => {
        return (
          <Message
            key={message.title + index}
            className="mb-2"
            title={message.title}
            description={message.description}
            createdAt={message.createdAt}
            footer=''
          />
        )
      })}
    </singleTimeline>
  )
}

export const styleRules = (props: SingleTimelineProps, layout: ConvertToLayoutTreeDraft<SingleTimelineLayout>) => {
  return [
  ]
}

export const designPattern = (props: SingleTimelineProps, layout: ConvertToLayoutTreeDraft<SingleTimelineLayout>) => {
  const logic = useLogic<LogicReturn>()
  return {}
}