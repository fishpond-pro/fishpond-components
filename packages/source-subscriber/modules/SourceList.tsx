import { h, SignalProps, PropTypes, useLogic, ConvertToLayoutTreeDraft, useModule } from '@polymita/renderer';
import { signal } from '@polymita/signal-model'
import * as AddSourceModule from './AddSource'

export const name = 'SourceList' as const
export let meta: {
  props: SourceListProps,
  layoutStruct: SourceListLayout
  patchCommands: []
}

export interface SourceListProps {
  title: string
}

export const propTypes = {
}

export const logic = (props: SignalProps<SourceListProps>) => {
  const sourceModalVisible = signal(false)
  return {
    sourceModalVisible,
  }
}
type LogicReturn = ReturnType<typeof logic>

export type SourceListLayout = {
  type: 'sourceListContainer',
  children: [
  ],
}
export const layout = (props: SourceListProps) => {
  const {
    sourceModalVisible,
  } = useLogic<LogicReturn>()

  const AddSourceCpt = useModule(AddSourceModule)

  console.log('re')

  return (
    h('sourceListContainer', { class: 'block' },
      h('listHeader', { class: 'flex p-2' }, 
        h('listTitle', { class: 'flex-1' },
          props.title
        ),
        h('addSourceEntry', {
          className: 'inline-block w-[24px] text-center cursor-pointer',
          onClick() {
            sourceModalVisible(true)
          }
        },
          '+'
        )
      ),
      h('listBody', { class: '' },
        
      ),
      h(AddSourceCpt, { visible: sourceModalVisible })
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
