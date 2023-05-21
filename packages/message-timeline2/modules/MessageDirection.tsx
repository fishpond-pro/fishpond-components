import { h, SignalProps, PropTypes, useLogic, ConvertToLayoutTreeDraft, createFunctionComponent } from '@polymita/renderer';
import * as MessageModule from './Message'
import { format } from 'date-fns'

export const name = 'MessageDirection' as const
export let meta: {
  props: MessageDirectionProps,
  layoutStruct: MessageDirectionLayout
  patchCommands: []
}

export interface MessageDirectionProps extends MessageModule.MessageProps {
  direction: 'left' | 'right',
  showYear?: boolean;
}

const getFormat = (showYear: boolean) => showYear ? 'yyyy-MM-dd hh:mm:ss' : 'MM-dd hh:mm:ss'

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
const Message = createFunctionComponent(MessageModule)
export const layout = (props: MessageDirectionProps) => {

  const dateStr = format(new Date(props.createdAt), getFormat(props.showYear));

  return (
    h('messageDirectionContainer', {},
      h(Message, { ...props }),
      props.direction === 'left' ? (
        h('direction-line', { class: 'block relative border-slate-100 h-[30px] border-l-[2px] border-b-[2px]', style: { marginLeft: '50%' } },
          h('created-time', { class: 'bg-white block border-slate-100 absolute text-xs top-full left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-slate-200' }, 
            dateStr
          ),
        )
      ) : null,
      props.direction === 'right' ? (
        h('direction-line', { class: 'block relative border-slate-100 h-[30px] border-r-[2px] border-b-[2px]', style: { marginRight: '50%' } },
          h('created-time', { class: 'bg-white block border-slate-100 absolute text-xs top-full left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-slate-200' },
            dateStr
          ),
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
