import { h, SignalProps, PropTypes, useLogic, ConvertToLayoutTreeDraft, useModule } from '@polymita/renderer';
import { after, Signal, signal } from '@polymita/signal'
import * as ModalModule from 'polymita/dist/components/modal'
import * as InputModule from 'polymita/dist/components/input'

export const name = 'AddSource' as const
export let meta: {
  props: AddSourceProps,
  layoutStruct: AddSourceLayout
  patchCommands: []
}

export interface AddSourceProps {
  visible: Signal<boolean>
}

export const propTypes = {
  visible: PropTypes.signal.isRequired,
}

export const logic = (props: SignalProps<AddSourceProps>) => {
  return {
  }
}
type LogicReturn = ReturnType<typeof logic>

export type AddSourceLayout = {
  type: 'addSourceContainer',
  children: [
  ]
}

export const layout = (props: AddSourceProps) => {

  const ModalCpt = useModule(ModalModule)
  const InputCpt = useModule(InputModule)

  const visible = props.visible();

  return (
    h('addSourceContainer', {},
      visible ? h(ModalCpt, { title: '数据源' },
        h('div', { class: 'modal-header' },
          h('row', {},
            h('label', {}, '名称'),
            h(InputCpt, { value: signal('') }),
          )
        )
      ) : ''
    )
  )
}

export const styleRules = (props: AddSourceProps, layout: ConvertToLayoutTreeDraft<AddSourceLayout>) => {
  return [
  ]
}

export const designPattern = (props: AddSourceProps, layout: ConvertToLayoutTreeDraft<AddSourceLayout>) => {
  const logic = useLogic<LogicReturn>()
  return {}
}
