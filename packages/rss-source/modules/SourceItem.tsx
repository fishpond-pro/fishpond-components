import { h, SignalProps, PropTypes, useLogic, ConvertToLayoutTreeDraft } from '@polymita/renderer';
import { after, Signal, signal } from '@polymita/signal'

export const name = 'SourceItem' as const
export let meta: {
  props: SourceItemProps,
  layoutStruct: SourceItemLayout
  patchCommands: []
}

export interface SourceItemProps {
}

export const propTypes = {
}

export const logic = (props: SignalProps<SourceItemProps>) => {
  return {
  }
}
type LogicReturn = ReturnType<typeof logic>

export type SourceItemLayout = {
  type: 'sourceItemContainer',
  children: [
  ]
}
export const layout = (props: SourceItemProps) => {
  const logic = useLogic<LogicReturn>()
  return (
    h('sourceItemContainer', {},
    )
  )
}

export const styleRules = (props: SourceItemProps, layout: ConvertToLayoutTreeDraft<SourceItemLayout>) => {
  return [
  ]
}

export const designPattern = (props: SourceItemProps, layout: ConvertToLayoutTreeDraft<SourceItemLayout>) => {
  const logic = useLogic<LogicReturn>()
  return {}
}
