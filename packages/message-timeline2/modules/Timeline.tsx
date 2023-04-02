import { h, SignalProps, PropTypes, useLogic, ConvertToLayoutTreeDraft, createComponent, useComponentModule } from '@polymita/renderer';
import { after, Signal, signal } from '@polymita/signal'
import * as MessageModule from './Message'
import type { Message } from '@/drivers/message';

export const name = 'Timeline' as const
export let meta: {
  props: TimelineProps,
  layoutStruct: TimelineLayout
  patchCommands: []
}

export interface TimelineProps {
  messages: Signal<Message[]>
}

export const propTypes = {
}

export const logic = (props: SignalProps<TimelineProps>) => {
  return {
  }
}
type LogicReturn = ReturnType<typeof logic>

export type TimelineLayout = {
  type: 'timelineContainer',
  children: [
  ]
}
/**
 * 按顺序，交叉拆分为左右2列
 */
function split (messages: Message[]) {
  const left: Message[] = [];
  const right: Message[] = [];

  messages.forEach((message, index) => {
    if (index % 2 === 0) {
      left.push(message);
    } else {
      right.push(message);
    }
  })

  return [left, right];
}

export const layout = (props: TimelineProps) => {
  const logic = useLogic<LogicReturn>()
  const Message = useComponentModule(MessageModule, {
    patchRules (props, draft) {
      return [
        {
          target: draft.messageContainer,
          style: {
            margin: '10px',
          }
        }
      ]
    } 
  });

  const messagesData = props.messages();

  const [left, right] = split(messagesData);

  return (
    h('timelineContainer', {
      class: 'block p-2 flex relative'
    },
      h('leftLine', {
        class: 'flex-1 min-w-0'
      }, 
        left.map((message) => {
          return h(
              Message,
              {
                key: message.id,
                title: message.title,
                description: message.description,
                footer: message.source?.platform
              }
          )
        }),
      ),
      h('centerLine', { class: 'w-[2px] bg-gray-200 absolute top-2 bottom-2 left-1/2 transform -translate-x-1/2'}),
      h('rightLine', {
        class: 'flex-1 min-w-0'
      },
        right.map((message) => {
          return h(
            Message,
            {
              key: message.id,
              title: message.title,
              description: message.description,
              footer: message.source?.platform
            }
          )      
        })
      )
    )
  )
}

export const styleRules = (props: TimelineProps, layout: ConvertToLayoutTreeDraft<TimelineLayout>) => {
  return [
  ]
}

export const designPattern = (props: TimelineProps, layout: ConvertToLayoutTreeDraft<TimelineLayout>) => {
  const logic = useLogic<LogicReturn>()
  return {}
}
