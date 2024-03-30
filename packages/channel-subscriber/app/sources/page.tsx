import React, { useEffect, useRef } from 'react'
import '@polymita/ui/index.css'
import ClientSources from './clientPage'
import channelSignal from '../polymita/signals/channel'
import rss from '../polymita/signals/rss'
import { getContext } from '../polymita/connect'
import menus from '@/models/rsshub-source-menu.json'

export default async function Sources () {

  const [channel, channelCtx] = await getContext(channelSignal)

  const [_, rssSourceCtx] = await getContext(rss, {
    menus,
  })

  return (
    <div className='flex h-screen w-full'>
      <ClientSources
        channelCtx={channelCtx}
        rssCtx={rssSourceCtx}
      />
    </div>
  )
}