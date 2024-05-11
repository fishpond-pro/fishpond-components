import { h, SignalProps, PropTypes, useLogic, ConvertToLayoutTreeDraft, VirtualLayoutJSON, createFunctionComponent } from '@polymita/renderer';
import * as AsideModule from './Aside'
import * as ContentModule from './Content'

export const name = 'App' as const
export const namespace = 'App' as const
export let meta: {
  props: AppProps,
  layoutStruct: AppLayout
  patchCommands: []
}

export interface AppProps {
}

export const propTypes = {
}

export const logic = (props: SignalProps<AppProps>) => {
  return {
  }
}
type LogicReturn = ReturnType<typeof logic>

export type AppLayout = {
  type: 'appContainer',
  children: [
  ]
}

const Aside = createFunctionComponent(AsideModule)
const Content = createFunctionComponent(ContentModule)

export const layout = (props: AppProps): VirtualLayoutJSON => {
  const logic = useLogic<LogicReturn>()
  return (
    <appContainer className='flex'>
      <div className='m-10 border'>
        <Aside>aside</Aside>
      </div>
      <div className='flex-1 m-10 border'>
        <Content>content</Content>
      </div>
    </appContainer>
  )
}

export const styleRules = (props: AppProps, layout: ConvertToLayoutTreeDraft<AppLayout>) => {
  return [
  ]
}

export const designPattern = (props: AppProps, layout: ConvertToLayoutTreeDraft<AppLayout>) => {
  const logic = useLogic<LogicReturn>()
  return {}
}
