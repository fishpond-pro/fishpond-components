import { useSignal } from '@polymita/connect/dist/react'
import React, { useState } from 'react'
import * as TimelineModule from '../modules/Timeline';
import { RenderToReact } from '@/shared/render';

const TimelineComponent = RenderToReact(TimelineModule);

const Timeline = (props: any) => {
  console.log('props: ', props);

  return (
    <TimelineComponent {...props} />
  )
}

export default Timeline;
