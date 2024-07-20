/// <reference path="../types/global.d.ts" />
import { h, SignalProps, PropTypes, useLogic, ConvertToLayoutTreeDraft, createFunctionComponent, VirtualLayoutJSON, classnames } from '@polymita/renderer';
import * as MessageModule from './Message'
import { MessageState } from '@/types/types'

export const name = 'SingleTimeline' as const
export const namespace = 'components'
export let meta: {
  props: SingleTimelineProps,
  layoutStruct: SingleTimelineLayout
  patchCommands: []
}

export interface SingleTimelineProps {
  messages: MessageItem[]
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

  const messagesData = props.messages;

  return (
    <singleTimeline className="h-full scroll-auto">
      {messagesData?.map((message, index) => {
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
              secondary={message.state === MessageState.Read}
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
