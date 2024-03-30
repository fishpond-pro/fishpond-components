'use client'
import React from 'react'
import Timeline from '../polymita/views/Timeline'
import messageDriver from '../polymita/signals/message'
import { IHookContext } from '@polymita/signal-model';
import { useSignal } from '../polymita/hooks';

export default function Main (props: { ctx: IHookContext }) {

  const message = useSignal(props.ctx, messageDriver);  
  
  return (
    <div className='main'>
      <Timeline messages={message.messages} />
    </div>
  )
}
