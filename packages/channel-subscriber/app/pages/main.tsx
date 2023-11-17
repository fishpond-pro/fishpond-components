import React from 'react'
import 'polymita/index.css'
import View from '@/views/ChannelList'
import channelDriver from '@/drivers/channel'
import { useSignal } from '@polymita/connect'

export default function Main () {

  const source = useSignal(channelDriver)

  console.log('ds:', source.channels())

  return (
    <div className="w-[300px] border"> 
      <View
        internalModal
        list={source.computedChannels}
        title="订阅源" 
        onSubmit={(arg) => {
          source.addRssChannel(arg)
        }}
        onClick={(item, i) => {
          console.log('item: ', i, item);
        }}
      />
    </div>
  )
}