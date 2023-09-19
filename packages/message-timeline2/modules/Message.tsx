import { h, SignalProps, PropTypes, useLogic, ConvertToLayoutTreeDraft } from '@polymita/renderer';

export const name = 'Message' as const
export let meta: {
  props: MessageProps,
  layoutStruct: MessageLayout
  patchCommands: []
}

export interface MessageProps {
  className?: string,
  title: string,
  description: string,
  footer?: string
  createdAt: string | Date; // Date.toString()
  onClick?: () => void;
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

  return (
    <messageContainer onClick={props.onClick} className={`block border rounded-md overflow-hidden ${props.className}`}>
      <messageTitle className="text-slate-800 block p-2 text-lg">{props.title}</messageTitle>
      <messageContent className="text-slate-400 block p-2 truncate">{props.description}</messageContent>
      <messageFooter className="text-slate-500 block border-t p-2 text-xs">{props.footer}</messageFooter>
    </messageContainer>
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
