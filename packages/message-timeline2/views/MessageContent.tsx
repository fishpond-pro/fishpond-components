import React, { useState } from 'react'
import * as Module from '../modules/MessageContent';
import { RenderToReact } from '@/shared/render';

const MessageContent = RenderToReact(Module);

const Timeline = (props: Module.MessageContentProps) => {

  return (
    <MessageContent {...props} />
  )
}

export default Timeline;
