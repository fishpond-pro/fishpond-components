import { h, SignalProps, PropTypes, useLogic, ConvertToLayoutTreeDraft, useModule } from '@polymita/renderer';
import { after, Signal, signal } from '@polymita/signal'
import * as MessageModule from './Message'
import { format } from 'date-fns'

export const name = 'MessageDirection' as const
export let meta: {
  props: MessageDirectionProps,
  layoutStruct: MessageDirectionLayout
  patchCommands: []
}

export interface MessageDirectionProps extends MessageModule.MessageProps {
  direction: 'left' | 'right'
}

export const propTypes = {
}

export const logic = (props: SignalProps<MessageDirectionProps>) => {
  return {
  }
}
type LogicReturn = ReturnType<typeof logic>

export type MessageDirectionLayout = {
  type: 'messageDirectionContainer',
  children: [
    MessageModule.MessageLayout,
  ]
}
export const layout = (props: MessageDirectionProps) => {
  const logic = useLogic<LogicReturn>()
  const Message = useModule(MessageModule)

  const dateStr = format(new Date(props.createdAt), 'yyyy-MM-dd hh:mm:ss');

  return (
    h('messageDirectionContainer', {},
      h(Message, { ...props }),
      props.direction === 'left' ? (
        h('direction-line', { class: 'block relative border-slate-100 h-[30px] border-l-[2px] border-b-[2px]', style: { marginLeft: '50%' } },
          h('created-time', { class: 'bg-white block border-slate-100 absolute text-xs top-full left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap' }, dateStr),
        )
      ) : null,
      props.direction === 'right' ? (
        h('direction-line', { class: 'block relative border-slate-100 h-[30px] border-r-[2px] border-b-[2px]', style: { marginRight: '50%' } },
          h('created-time', { class: 'bg-white block border-slate-100 absolute text-xs top-full left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap' }, dateStr),
        )
      ) : null,
    )
  )
}

export const styleRules = (props: MessageDirectionProps, layout: ConvertToLayoutTreeDraft<MessageDirectionLayout>) => {
  return [
  ]
}

export const designPattern = (props: MessageDirectionProps, layout: ConvertToLayoutTreeDraft<MessageDirectionLayout>) => {
  const logic = useLogic<LogicReturn>()
  return {}
}
