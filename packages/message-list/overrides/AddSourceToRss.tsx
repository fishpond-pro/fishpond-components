import { h, SignalProps, useLogic, ConvertToLayoutTreeDraft, CommandOP, extendModule, VirtualLayoutJSON } from '@polymita/renderer';
import * as rsa from '@polymita/rss-sources-add'
import { usePathname } from 'next/navigation';
import { Link } from 'react-router-dom'
import mi from '@/models/indexes.json'
import { writePrisma } from '@polymita/next-connect';
import { getRSSComplementURL } from '@/shared/utils';
import type { RSSItem } from '../../rss-sources/dist/signals/shared/utils';
import type { Message } from '@/models/indexesTypes'

export interface AddSourceToRssProps {
  
}

function patchLogic(
  props: typeof rsa.overrides.AddRSSSource.meta.props & AddSourceToRssProps,
  prevLogicResult: any,
) {

  console.log('[AddSourceToRss] patchLogic', arguments)

  const writeChannelRecord = writePrisma(mi.namespace, mi.channelRecord)
  const writeMessage = writePrisma<Message[]>(mi.namespace, mi.message)

  const previewItems: RSSItem[] = prevLogicResult.previewItems

  return {
    ...prevLogicResult,
    setDrawerVisible (v) {
      prevLogicResult.setDrawerVisible(v)
      console.log('111')
    },
    async confirmSubmit () {
      prevLogicResult.confirmSubmit()

      const destUrl = getRSSComplementURL({
        path: props.value.route.path,
        payload: prevLogicResult.formValues,
      })

      const channel = await writeChannelRecord.create({
        name: prevLogicResult.formValues.title || props.value.title,
        channel: destUrl,
        lastUpdatedDate: new Date(),
      })
      
      writeMessage.createMany(previewItems.map(obj => ({
        link: obj.link,
        title: obj.title,
        time: new Date(obj.pubDate),
        description: obj.description,        
        type: 'article',
        channelRecordId: channel.id,
      })))
    }
  }
}

const NewModule = extendModule(rsa.overrides.AddRSSSource, () => ({
  patchLogic,
}))

export const meta = NewModule.meta
export const base = NewModule.base
export const name = 'AddSourceToRss'
export const namespace = NewModule.namespace
//
export const override = NewModule.override
export const layout = NewModule.layout
export const logic = NewModule.logic
export const designPattern = NewModule.designPattern
export const designPatterns = NewModule.designPatterns
export const styleRules = NewModule.styleRules