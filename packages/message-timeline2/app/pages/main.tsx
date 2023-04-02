import React from 'react'
import { useSignal } from '@polymita/connect/dist/react';
import Timeline from '../../views/Timeline'
import messageDriver from '@/drivers/message'

export default function Main () {

  const message = useSignal(messageDriver);  
  
  console.log('message: ', message.messages());

  return (
    <div className='main'>
      <Timeline messages={message.messages} />
    </div>
  )
}
