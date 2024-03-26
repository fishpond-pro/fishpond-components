import React from 'react'
import '@polymita/ui/index.css'
import { signalMap } from '../polymita/signalsMap'
import { getContext } from '../polymita/connect'
import ClientMain from './clientPage'

export default async function Main () {

  const [_, sourceCtx] = await getContext(signalMap.channel)

  return (
    <div className="w-[300px] border"> 
      <ClientMain ctx={sourceCtx} />
    </div>
  )
}