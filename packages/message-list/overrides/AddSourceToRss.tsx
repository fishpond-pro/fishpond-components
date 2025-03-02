import { h, SignalProps, useLogic, ConvertToLayoutTreeDraft, CommandOP, extendModule, VirtualLayoutJSON } from '@polymita/renderer';
import * as rsa from '@polymita/rss-sources-add'
import { usePathname } from 'next/navigation';
import { Link } from 'react-router-dom'
import mi from '@/models/indexes.json'
import { writePrisma } from '@polymita/next-connect';
import { getRSSComplementURL } from '@/shared/utils';

export interface AddSourceToRssProps {
  
}

function patchLogic(
  props: typeof rsa.overrides.AddRSSSource.meta.props & AddSourceToRssProps,
  prevLogicResult: any,
) {

  console.log('[AddSourceToRss] patchLogic', arguments)

  const writeChannelRecord = writePrisma(mi.channelRecord)

  return {
    ...prevLogicResult,
    setDrawerVisible (v) {
      prevLogicResult.setDrawerVisible(v)
      console.log('222')
    },
    confirmSubmit () {
      prevLogicResult.confirmSubmit()
      console.log('222')

      const destUrl = getRSSComplementURL({
        path: props.value.route.path,
        payload: prevLogicResult.formValues,
      })

      writeChannelRecord.create({
        name: prevLogicResult.formValues.title || props.value.title,
        channel: destUrl,
        lastUpdatedDate: new Date(),
      })
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