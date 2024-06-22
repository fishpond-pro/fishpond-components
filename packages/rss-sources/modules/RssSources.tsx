import { h, SignalProps, PropTypes, useLogic, ConvertToLayoutTreeDraft, VirtualLayoutJSON } from '@polymita/renderer';
import '@polymita/renderer/jsx-runtime';
import { useState } from 'react';

export const name = 'RssSources' as const
export const namespace = 'components' as const
export let meta: {
  props: RssSourcesProps,
  layoutStruct: RssSourcesLayout
  patchCommands: []
}

export interface RssSourcesProps {
}

export const propTypes = {
}

export const logic = (props: SignalProps<RssSourcesProps>) => {
  return {
  }
}
type LogicReturn = ReturnType<typeof logic>

export type RssSourcesLayout = {
  type: 'rssSourcesContainer',
  children: [
  ]
}
export const layout = (props: RssSourcesProps): VirtualLayoutJSON => {
  const logic = useLogic<LogicReturn>()
  return (
    <rssSourcesContainer>
      sources
    </rssSourcesContainer>
  )
}

export const styleRules = (props: RssSourcesProps, layout: ConvertToLayoutTreeDraft<RssSourcesLayout>) => {
  return [
  ]
}

export const designPattern = (props: RssSourcesProps, layout: ConvertToLayoutTreeDraft<RssSourcesLayout>) => {
  const logic = useLogic<LogicReturn>()
  return {}
}
