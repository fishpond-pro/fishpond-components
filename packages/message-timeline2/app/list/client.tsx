'use client'
import React, { useEffect, useState } from 'react'
import SingleTimeline from '../../views/SingleTimeline'
import messageDriver from '../polymita/signals/message'
import MessageContent from '../polymita/views/MessageContent';
import { IHookContext } from '@polymita/signal-model';
import { useSignal } from '../polymita/hooks';

export default function Main (props: { ctx: IHookContext }) {

  const message = useSignal(props.ctx, messageDriver);  
  
  const [mid, setMid] = React.useState<number>(0);

  useEffect(() => {
    if (mid) {
      message.queryMessageByMessageId(mid)
    }
  }, [mid])

  const item = message.currentMessageItem();

  return (
    <div className='flex h-screen'>
      <div className='main w-[300px] p-4'>
        <p>
          <input 
            type="number" 
            placeholder='message.id'
            className="mb-4 w-full p-2 border border-gray-300 rounded-md" 
            value={mid} 
            onChange={(e) => { setMid(parseInt(e.target.value)) }}
          />
        </p>
        <p>
          <button 
            className="border p-2 mb-4"
            onClick={() => message.queryMessageAll()}>queryMessageAll</button>
        </p>

        <SingleTimeline 
          messages={message.messages} 
          onClick={item => {
            message.selectMessage(item)
          }}
        />
      </div>
      <div className='flex-1 border p-4 h-full min-h-0'>
        {item && (
          <MessageContent
            mode='new-window'
            displayType='normal'
            title={item.title}
            description={item.description}
            contentLink={item.link}
          />
        )}
      </div>
    </div>
  )
}
