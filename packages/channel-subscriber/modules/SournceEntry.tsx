import { h, SignalProps, PropTypes, useLogic, ConvertToLayoutTreeDraft, VirtualLayoutJSON } from '@polymita/renderer';
import { after, Signal, signal } from '@polymita/signal'
import ReloadIcon from 'polymita/icons/reload'

export const name = 'SourceEntry' as const
export let meta: {
  props: SourceEntryProps,
  layoutStruct: SourceEntryLayout
  patchCommands: []
}

export interface SourceEntryProps {
  onClickRefresh?: () => void;
}

export const propTypes = {
}

export const logic = (props: SignalProps<SourceEntryProps>) => {
  return {
  }
}
type LogicReturn = ReturnType<typeof logic>

export type SourceEntryLayout = {
  type: 'sourceEntryContainer',
  children: [
  ]
}
export const layout = (props: SourceEntryProps): VirtualLayoutJSON => {
  const logic = useLogic<LogicReturn>()
  return (
    <sourceEntryContainer className='flex'>
      <sourceEntryTitle className='flex-1'>
        订阅源
      </sourceEntryTitle>

      <refreshButton onClick={props.onClickRefresh} className='cursor-pointer'>
        <ReloadIcon />
      </refreshButton>
    </sourceEntryContainer>
  )
}

export const styleRules = (props: SourceEntryProps, layout: ConvertToLayoutTreeDraft<SourceEntryLayout>) => {
  return [
  ]
}

export const designPattern = (props: SourceEntryProps, layout: ConvertToLayoutTreeDraft<SourceEntryLayout>) => {
  const logic = useLogic<LogicReturn>()
  return {}
}
