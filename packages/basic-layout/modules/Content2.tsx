import { h, SignalProps, PropTypes, useLogic, ConvertToLayoutTreeDraft, VirtualLayoutJSON } from '@polymita/renderer';
import '@polymita/renderer/jsx-runtime';
import { useState } from 'react';

export const name = 'Content' as const
export const namespace = 'components' as const
export let meta: {
  props: ContentProps,
  layoutStruct: ContentLayout
  patchCommands: []
}

export interface ContentProps {
  children?: any
}

export const propTypes = {
}

export const logic = (props: SignalProps<ContentProps>) => {

  const [name, setName] = useState('0')

  const changeName = (e) => {
    console.log('e: ', e);
    setName('new name' + Date.now())
  }

  return {
    name,
    changeName,
  }
}
type LogicReturn = ReturnType<typeof logic>

export type ContentLayout = {
  type: 'contentContainer',
  children: [
  ]
}
export const layout = (props: ContentProps): VirtualLayoutJSON => {
  const logic = useLogic<LogicReturn>()
  return (
    <content2Container>
      name: {logic.name} <br/>
      <button onClick={logic.changeName}>click here</button>
    </content2Container>
  )
}

export const styleRules = (props: ContentProps, layout: ConvertToLayoutTreeDraft<ContentLayout>) => {
  return [
  ]
}

export const designPattern = (props: ContentProps, layout: ConvertToLayoutTreeDraft<ContentLayout>) => {
  const logic = useLogic<LogicReturn>()
  return {}
}
