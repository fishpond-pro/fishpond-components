import React, { useEffect } from 'react'
import { useSignal } from '@polymita/connect';
import SingleTimeline from '../../views/SingleTimeline'
import messageDriver from '@/drivers/message'

export default function Main () {

  const message = useSignal(messageDriver);  
  
  console.log('message: ', message.messages());

  const [mid, setMid] = React.useState<number>(0);

  useEffect(() => {
    if (mid) {
      message.params(d => {
        d.channelRecordId = mid;
      })
    } else {
      message.params(d => ({}))
    }
  }, [mid])

  return (
    <div className='main w-[300px] p-4'>
      <input 
        type="number" 
        placeholder='message.id'
        className="mb-4 w-full p-2 border border-gray-300 rounded-md" 
        value={mid} 
        onChange={(e) => { setMid(parseInt(e.target.value)) }}
      />

      <SingleTimeline messages={message.messages} />
    </div>
  )
}
