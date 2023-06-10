import { h, SignalProps, PropTypes, useLogic, ConvertToLayoutTreeDraft, createFunctionComponent, StyleRule } from '@polymita/renderer';
import { after, Signal, signal } from '@polymita/signal-model'
import * as MessageModule from './MessageDirection'
import type { MessageItem } from '@/drivers/message';

export const name = 'Timeline' as const
export let meta: {
  props: TimelineProps,
  layoutStruct: TimelineLayout
  patchCommands: []
}

export interface TimelineProps {
  messages: Signal<MessageItem[]>
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
function split (messages: MessageItem[]) {
  const left: MessageItem[] = [];
  const right: MessageItem[] = [];

  messages.forEach((message, index) => {
    if (index % 2 === 0) {
      left.push(message);
    } else {
      right.push(message);
    }
  })

  return [left, right];
}

const Message = createFunctionComponent(MessageModule, {
  patchRules (props, draft) {
    return [
      {
        target: draft.messageDirectionContainer,
        style: {
          display: 'block',
          margin: '10px',
        }
      }
    ]
  } 
});
export const layout = (props: TimelineProps) => {
  const logic = useLogic<LogicReturn>()

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
                footer: message.source?.platform,
                createdAt: message.createdAt,
                direction: 'left'
              }
          )
        }),
      ),
      h('centerLine', { class: 'w-[2px] bg-gray-200 absolute top-2 bottom-2 left-1/2 -translate-x-1/2'}),
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
              footer: message.source?.platform,
              createdAt: message.createdAt,
              direction: 'right'
            }
          )      
        })
      )
    )
  )
}

export const styleRules = (props: TimelineProps, layout: ConvertToLayoutTreeDraft<TimelineLayout>): StyleRule[] => {
  return [
  ]
}

export const designPattern = (props: TimelineProps, layout: ConvertToLayoutTreeDraft<TimelineLayout>) => {
  const logic = useLogic<LogicReturn>()
  return {}
}
