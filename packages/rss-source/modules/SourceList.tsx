import { h, SignalProps, PropTypes, useLogic, ConvertToLayoutTreeDraft, createFunctionComponent, VirtualLayoutJSON } from '@polymita/renderer';
import * as SourceItemModule from './SourceItem'

export const name = 'SourceList' as const
export let meta: {
  props: SourceListProps,
  layoutStruct: SourceListLayout
  patchCommands: []
}


export interface SourceListProps {
  sources: SourceItemModule.RSSSource[]
  width: number
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

const COLUMN_WIDTH = 4;

export const layout = (props: SourceListProps): VirtualLayoutJSON => {
  const logic = useLogic<LogicReturn>()

  const columnWidth = props.width / COLUMN_WIDTH

  return (
    h('sourceListContainer', { className: "block" },
      <div style={{ columnCount: COLUMN_WIDTH }}>
        {props.sources.map(source => (
          <SourceItem width={columnWidth} key={`${source.group}-${source.subGroup}-${source.title}`} value={source} />
        ))}
      </div>
    )
    // <sourceListContainer className="block">
    //   <div style={{ columnCount: COLUMN_WIDTH }}>
    //     {props.sources.map(source => (
    //       <SourceItem width={columnWidth} key={`${source.group}-${source.subGroup}-${source.title}`} value={source} />
    //     ))}
    //   </div>
    // </sourceListContainer>
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
