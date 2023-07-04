import { h, SignalProps, PropTypes, useLogic, ConvertToLayoutTreeDraft, createFunctionComponent } from '@polymita/renderer';
import * as SourceItemModule from './SourceItem'

export const name = 'SourceList' as const
export let meta: {
  props: SourceListProps,
  layoutStruct: SourceListLayout
  patchCommands: []
}


export interface SourceListProps {
  sources: SourceItemModule.RSSSource[]
}

export const propTypes = {
}

const SourceItem = createFunctionComponent(SourceItemModule)

export const logic = (props: SignalProps<SourceListProps>) => {
  return {
  }
}
type LogicReturn = ReturnType<typeof logic>

export type SourceListLayout = {
  type: 'sourceListContainer',
  children: [
  ]
}
export const layout = (props: SourceListProps) => {
  const logic = useLogic<LogicReturn>()
  return (
    h('sourceListContainer', {}, 
      h('div', { className: 'columns-4 gap-1' },
        props.sources.map(source => h(SourceItem, { key: `${source.group}-${source.subGroup}-${source.title}`, value: source }))
      )
    )
  )
}

export const styleRules = (props: SourceListProps, layout: ConvertToLayoutTreeDraft<SourceListLayout>) => {
  return [
  ]
}

export const designPattern = (props: SourceListProps, layout: ConvertToLayoutTreeDraft<SourceListLayout>) => {
  const logic = useLogic<LogicReturn>()
  return {}
}
