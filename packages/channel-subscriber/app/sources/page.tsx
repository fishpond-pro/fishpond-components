import React, { useEffect, useRef } from 'react'
import '@polymita/ui/index.css'
import ClientSources from './clientPage'
import { signalMap } from '../polymita/signalsMap'
import { getContext } from '../polymita/connect'
import menus from '@/models/rsshub-source-menu.json'

export default async function Sources () {

  const [channel, channelCtx] = await getContext(signalMap.channel)

  const [_, rssSourceCtx] = await getContext(signalMap.rss, {
    subscribed: channel.channelsWithForm,
    menus,
  })

  return (
    <div className='flex h-screen'>
      <div className='w-[200px] border-r border-slate-100 h-full'>
        <ClientSources
          channelCtx={channelCtx}
          rssCtx={rssSourceCtx}
        />
      </div>
    </div>
  )
}