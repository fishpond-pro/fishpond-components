import React, { useEffect } from 'react'
import { useSignal } from '@polymita/connect';
import SingleTimeline from '../../views/SingleTimeline'
import messageDriver from '@/drivers/message'

export default function Main () {

  const message = useSignal(messageDriver);  
  
  const [mid, setMid] = React.useState<number>(0);

  useEffect(() => {
    if (mid) {
      message.queryMessageByMessageId(mid)
    }
  }, [mid])

  return (
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

      <SingleTimeline messages={message.messages} />
    </div>
  )
}
