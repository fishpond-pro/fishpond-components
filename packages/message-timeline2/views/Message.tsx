import { useSignal } from '@polymita/connect/dist/react'
import React, { useState } from 'react'
import * as MessageModule from '../modules/Message';
import { RenderToReact } from '@/shared/render';

const MessageComponent = RenderToReact(MessageModule);

const Message = (props: any) => {

  return (
    <MessageComponent {...props} />
  )
}

export default Message