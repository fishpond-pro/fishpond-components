import { h, SignalProps, PropTypes, useLogic, ConvertToLayoutTreeDraft } from '@polymita/renderer';
import { after, Signal, signal } from '@polymita/signal'

export const name = 'Message' as const
export let meta: {
  props: MessageProps,
  layoutStruct: MessageLayout
  patchCommands: []
}

export interface MessageProps {
  name: string
}

export const propTypes = {
}

export const logic = (props: SignalProps<MessageProps>) => {
  return {
  }
}
type LogicReturn = ReturnType<typeof logic>

export type MessageLayout = {
  type: 'messageContainer',
  children: [
  ]
}
export const layout = (props: MessageProps) => {
  const logic = useLogic<LogicReturn>()
  // return (
  //   <messageContainer>
  //      my mc <br/>
  //      {props.name}
  //   </messageContainer>
  // )
  return h(
    'messageContainer', { className: 'block border' },
      h('messageTitle', { className: 'text-slate-800 block border-b p-2 text-lg' }, props.name),
      h('messageContent', { className: 'text-slate-400 block p-2' },
        'my-content',
      ),
      h('messageFooter', { className: 'text-slate-500 block border-t p-2 text-xs' },
        'footer'
      )
  )
}

export const styleRules = (props: MessageProps, layout: ConvertToLayoutTreeDraft<MessageLayout>) => {
  return [
  ]
}

export const designPattern = (props: MessageProps, layout: ConvertToLayoutTreeDraft<MessageLayout>) => {
  const logic = useLogic<LogicReturn>()
  return {}
}
