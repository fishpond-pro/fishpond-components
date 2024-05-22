'use client'
import React from 'react'
import Timeline from '../polymita/views/Timeline'
import messageDriver from '@/signals/message'

export default function Main (props: { }) {

  const message = messageDriver();  
  
  return (
    <div className='main'>
      <Timeline messages={message.messages} />
    </div>
  )
}
