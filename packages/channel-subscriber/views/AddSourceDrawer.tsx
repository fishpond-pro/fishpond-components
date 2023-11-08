import React, { useState } from 'react'
import * as ComponentModule from '../modules/AddSourceDrawer';
import { RenderToReact } from '@/shared/render';

const Component = RenderToReact(ComponentModule);

const Timeline = (props: ComponentModule.AddSourceDrawerProps) => {

  return (
    <Component {...props} />
  )
}

export default Timeline;
