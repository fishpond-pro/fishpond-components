import React, { useState } from 'react'
import * as SingleTimelineModule from '../modules/SingleTimeline';
import { RenderToReact } from '@/shared/render';

const SingleTimelineComponent = RenderToReact(SingleTimelineModule);

const Timeline = (props: SingleTimelineModule.SingleTimelineProps) => {

  return (
    <SingleTimelineComponent {...props} />
  )
}

export default Timeline;
