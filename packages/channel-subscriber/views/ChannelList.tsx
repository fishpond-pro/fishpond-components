import React, { useState } from 'react'
import * as ComponentModule from '../modules/ChannelList';
import { RenderToReact } from '@/shared/render';

const Component = RenderToReact(ComponentModule);

export interface SourceListProps extends ComponentModule.ChannelListProps {
}

const SourceList = (props: SourceListProps) => {
  return (
    <Component {...props} />
  )
}

export default SourceList;
