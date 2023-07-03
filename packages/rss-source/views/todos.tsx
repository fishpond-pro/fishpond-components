import { useSignal } from '@polymita/connect/dist/react'
import React, { useState } from 'react'
import * as ComponentModule from '../modules/SourceList';
import { RenderToReact } from '@/shared/render';

const Component = RenderToReact(ComponentModule);

const Timeline = (props: any) => {
  console.log('props: ', props);

  return (
    <Component {...props} />
  )
}

export default Timeline;
