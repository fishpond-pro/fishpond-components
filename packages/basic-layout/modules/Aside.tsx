import { h, SignalProps, PropTypes, useLogic, ConvertToLayoutTreeDraft, VirtualLayoutJSON } from '@polymita/renderer';

export const name = 'Aside' as const
export const namespace = 'components' as const

export let meta: {
  props: AsideProps,
  layoutStruct: AsideLayout
  patchCommands: []
}

export interface AsideProps {
  children?: any
}

export const propTypes = {
}

export const logic = (props: SignalProps<AsideProps>) => {
  return {
  }
}
type LogicReturn = ReturnType<typeof logic>

export type AsideLayout = {
  type: 'asideContainer',
  children: [
  ]
}
export const layout = (props: AsideProps): VirtualLayoutJSON => {
  const logic = useLogic<LogicReturn>()
  return (
    <asideContainer>
      {props.children}
    </asideContainer>
  )
}

export const styleRules = (props: AsideProps, layout: ConvertToLayoutTreeDraft<AsideLayout>) => {
  return [
  ]
}

export const designPattern = (props: AsideProps, layout: ConvertToLayoutTreeDraft<AsideLayout>) => {
  const logic = useLogic<LogicReturn>()
  return {}
}
