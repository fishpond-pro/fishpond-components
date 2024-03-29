import React from 'react'
import '@polymita/ui/index.css'
import channel from '../polymita/signals/channel'
import { getContext } from '../polymita/connect'
import ClientMain from './clientPage'

export default async function Main () {

  const [_, sourceCtx] = await getContext(channel)

  return (
    <div className="w-[300px] border"> 
      <ClientMain ctx={sourceCtx} />
    </div>
  )
}