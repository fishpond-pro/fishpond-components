import { h, SignalProps, PropTypes, useLogic, ConvertToLayoutTreeDraft, classNames } from '@polymita/renderer';

export const name = 'Message' as const
export const namespace = 'components'
export let meta: {
  props: MessageProps,
  layoutStruct: MessageLayout
  patchCommands: []
}

export interface MessageProps {
  mode?: string
  className?: string,
  title: string,
  description: string,
  footer?: string
  createdAt: string | Date; // Date.toString()
  onClick?: () => void;
  border?: boolean;
  active?: boolean;
  secondary?: boolean;
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

  const cls1 = classNames(`block text-base rounded-md overflow-hidden cursor-default`, props.className, {
    border: props.border,
    'opacity-70': props.secondary,
  });
  const cls2 = classNames('text-sm text-slate-500 block p-2 text-xs', {
    'border-t': props.border
  })

  return (
    <messageContainer onClick={props.onClick} className={cls1}>
      <messageTitle className="text-slate-800 block p-2 text-base">{props.title}</messageTitle>
      <messageDescription className="text-slate-400 block px-2 truncate text-sm" >{props.description}</messageDescription>
      <messageFooter if={!!props.footer} className={cls2}>{props.footer}</messageFooter>
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
