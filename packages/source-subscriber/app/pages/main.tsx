import React from 'react'
import 'polymita/dist/components/index.css'
import View from '@/views/sourceList'
import SourceDriver from '@/drivers/source'
import { useSignal } from '@polymita/connect/dist/react'

export default function Main () {

  const source = useSignal(SourceDriver)

  console.log('ds:', source.ds())

  return (
    <div className="w-[300px] border"> 
      <View
        list={source.ds as any}
        title="订阅源" 
        onSubmit={(arg) => {
          source.addSource(arg)
        }}
        onClick={(item, i) => {
          console.log('item: ', i, item);
        }}
      />
    </div>
  )
}