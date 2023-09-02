import React from 'react'
import { useSignal } from '@polymita/connect';
import SingleTimeline from '../../views/SingleTimeline'
import messageDriver from '@/drivers/message'

export default function Main () {

  const message = useSignal(messageDriver);  
  
  console.log('message: ', message.messages());

  return (
    <div className='main w-[300px] p-4'>
      <SingleTimeline messages={message.messages} />
    </div>
  )
}
