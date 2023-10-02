import { h, SignalProps, PropTypes, useLogic, ConvertToLayoutTreeDraft, createFunctionComponent, VirtualLayoutJSON, classnames } from '@polymita/renderer';
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
  onClick?: (item: MessageItem, index: number) => void;
  selected?: number;
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
  const { selected } = props;
  const logic = useLogic<LogicReturn>()

  const messagesData = props.messages();

  return (
    <singleTimeline>
      {messagesData.map((message, index) => {
        const current = message.id === selected;
        const cls = classnames('block p-2 mb-1 box-border rounded-md overflow-hidden cursor-default hover:bg-slate-50', {
          'bg-slate-50': current
        });
        return (
          <singleTimelineItem className={cls}>
            <Message
              onClick={() => props.onClick(message, index)}
              key={message.title + index}
              title={message.title}
              description={message.description}
              createdAt={message.createdAt}
              footer=''
              border={false}
            />
          </singleTimelineItem>
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
