import React, { useState } from 'react'
import * as ComponentModule from '../modules/RSSSourceList';
import { RenderToReact } from '@/shared/render';

const Component = RenderToReact(ComponentModule);

const Timeline = (props: ComponentModule.SourceListProps) => {

  return (
    <Component {...props} />
  )
}

export default Timeline;
