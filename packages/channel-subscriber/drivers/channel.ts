import {
  inputComputeInServer,
  model,
  prisma,
  signal,
  writeModel,
  writePrisma,
} from '@polymita/signal-model'
import indexes from '@/models/indexes.json'
import { parseRSSUrl } from '@/shared/utils'
import { SubscribedChannel, SubscribedChannelWithForm } from '@/shared/types'

export default function channel () {
  const currentChannel = signal<string>(null);

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
  const computedChannels = signal(() => {
    return channels();
  })

  const channelsWithForm = signal<SubscribedChannelWithForm[]>(() => {
    const source = channels()
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
  })

  const writeSource = writePrisma(channels, () => ({
  }))

  const addRssChannel = inputComputeInServer(function * (arg: {
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

    yield writeSource.upsert({
      channel: arg.platform,
    }, {
      type: 0,
      channel: arg.platform,
      rss,
    })
  })

  return {
    currentChannel,
    channels,
    computedChannels,
    channelsWithForm,
    addRssChannel
  }
}