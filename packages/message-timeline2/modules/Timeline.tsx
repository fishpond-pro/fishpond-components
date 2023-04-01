import { h, SignalProps, PropTypes, useLogic, ConvertToLayoutTreeDraft, createComponent, useComponentModule } from '@polymita/renderer';
import { after, Signal, signal } from '@polymita/signal'
import * as MessageModule from './Message'

export const name = 'Timeline' as const
export let meta: {
  props: TimelineProps,
  layoutStruct: TimelineLayout
  patchCommands: []
}

export interface TimelineProps {
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

export const layout = (props: TimelineProps) => {
  const logic = useLogic<LogicReturn>()

  const Message = useComponentModule(MessageModule);

  return (
    h('timelineContainer', {},
      h(Message, {})
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
