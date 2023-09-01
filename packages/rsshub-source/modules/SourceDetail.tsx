import { h, SignalProps, PropTypes, useLogic, ConvertToLayoutTreeDraft } from '@polymita/renderer';
import { after, Signal, signal } from '@polymita/signal'

export const name = 'SourceDetail' as const
export let meta: {
  props: SourceDetailProps,
  layoutStruct: SourceDetailLayout
  patchCommands: []
}

export interface SourceDetailProps {
}

export const propTypes = {
}

export const logic = (props: SignalProps<SourceDetailProps>) => {
  return {
  }
}
type LogicReturn = ReturnType<typeof logic>

export type SourceDetailLayout = {
  type: 'sourceDetailContainer',
  children: [
  ]
}
export const layout = (props: SourceDetailProps) => {
  const logic = useLogic<LogicReturn>()
  return (
    h('sourceDetailContainer', {})
  )
}

export const styleRules = (props: SourceDetailProps, layout: ConvertToLayoutTreeDraft<SourceDetailLayout>) => {
  return [
  ]
}

export const designPattern = (props: SourceDetailProps, layout: ConvertToLayoutTreeDraft<SourceDetailLayout>) => {
  const logic = useLogic<LogicReturn>()
  return {}
}
