import {
  prisma,
  writePrisma,
} from '@polymita/next-connect'
import indexes from '../models/indexes.json'
import { parseRSSUrl } from '../shared/utils'
import { SubscribedChannel, SubscribedChannelWithForm } from '../shared/types'
import { useMemo, useState } from 'react'
export * from '../shared/types'

export default function channel () {
  const [currentChannel, setCurrentChannel] = useState<string>();

  const channels = prisma<SubscribedChannel[]>(indexes.subscribedChannel, () => {
    // const c = currentChannel();
    // if (!c) {
    //   return;
    // }
    return ({
      where: {
        // channel: currentChannel(),
      },
      orderBy: {
        modifiedAt: 'desc',
      },
      include: {
        rss: true,
        rpa: true
      }
    })
  })
  const computedChannels = channels

  const channelsWithForm = useMemo<SubscribedChannelWithForm[]>(() => {
    const source = channels
    return source.map(s => {
      if (s.type !== 0) {
      }
      return {
        ...s,
        rss: s.rss.map(r => {
          const { path, payload } = parseRSSUrl(r.href)
          return {
            ...r,
            path,
            payload,
          }
        })
      }
    })
  }, [channels])

  const writeSource = writePrisma(indexes.subscribedChannel)

  const addRssChannel = async function (arg: {
    name: string, 
    link: string,
    platform: string,
  }) {
    let rss = undefined;
    if (arg.name) {
      rss = {
        name: arg.name,
        href: arg.link,
      }
    }

    await writeSource.upsert({
      channel: arg.platform,
    }, {
      type: 0,
      channel: arg.platform,
      rss,
    })
  }

  return {
    currentChannel,
    setCurrentChannel,
    channels,
    computedChannels,
    channelsWithForm,
    addRssChannel
  }
}