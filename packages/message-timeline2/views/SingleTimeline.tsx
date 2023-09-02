import React, { useState } from 'react'
import * as SingleTimelineModule from '../modules/SingleTimeline';
import { RenderToReact } from '@/shared/render';

const SingleTimelineComponent = RenderToReact(SingleTimelineModule);

const Timeline = (props: any) => {
  console.log('props: ', props);

  return (
    <SingleTimelineComponent {...props} />
  )
}

export default Timeline;
