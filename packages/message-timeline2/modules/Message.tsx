import { h, SignalProps, PropTypes, useLogic, ConvertToLayoutTreeDraft } from '@polymita/renderer';

export const name = 'Message' as const
export let meta: {
  props: MessageProps,
  layoutStruct: MessageLayout
  patchCommands: []
}

export interface MessageProps {
  title: string,
  description: string,
  footer: string
  createdAt: string // Date.toString()
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
  const logic = useLogic<LogicReturn>();

  return h(
    'messageContainer', { class: 'block border rounded-md overflow-hidden' },
      h('messageTitle', { class: 'text-slate-800 block p-2 text-lg' }, props.title),
      h('messageContent', { class: 'text-slate-400 block p-2 truncate' },
        props.description,
      ),
      h('messageFooter', { class: 'text-slate-500 block border-t p-2 text-xs' },
        props.footer
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
