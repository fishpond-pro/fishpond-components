import React, { useEffect, useState } from 'react'
import { useSignal } from '@polymita/connect';
import SingleTimeline from '../../views/SingleTimeline'
import messageDriver, { MessageItem } from '@/drivers/message'
import MessageContent from '@/views/MessageContent';

export default function Main () {

  const message = useSignal(messageDriver);  
  
  const [mid, setMid] = React.useState<number>(0);

  useEffect(() => {
    if (mid) {
      message.queryMessageByMessageId(mid)
    }
  }, [mid])

  const [current, setCurrent] = useState<MessageItem>()
  console.log('current: ', current);

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
            setCurrent(item)
          }}
        />
      </div>
      <div className='flex-1 border p-4 h-full min-h-0'>
        {current && (
          <MessageContent
            displayType='normal'
            title={current.title}
            description={current.description}
            contentLink={current.link}
          />
        )}
      </div>
    </div>
  )
}
