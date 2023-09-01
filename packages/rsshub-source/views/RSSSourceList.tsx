import React, { useState } from 'react'
import * as ComponentModule from '../modules/RSSSourceList';
import { RenderToReact } from '@/shared/render';

const Component = RenderToReact(ComponentModule);

const Timeline = (props: any) => {
  console.log('props: ', props);

  return (
    <Component {...props} />
  )
}

export default Timeline;
