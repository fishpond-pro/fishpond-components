'use client'
import rssSignal from '@/signals/rss'
import Sources from '../polymita/views/RssSources'
import menus from '@/shared/rsshub-source-menu.json'
import rsshubSourcesMock from '@/shared/rsshub-sources.json'
import { toRSS_JSON } from '@/shared/utils'
import sourceMock2 from '@/shared/rss-mock'

export default () => {

  const rssSource = rssSignal({
    subscribed: [],
    menus,
    onQueryRssSources: async (arg) => {
      const r = arg.map(([g, subGroup]) => {
        return rsshubSourcesMock.filter(item => 
          item.group === g && item.subGroup === subGroup
        )
      }).flat().map(item => ({
        ...item,
        tables: typeof item.tables === 'string' ? [item.tables] : item.tables
      }));
      return r
    },
    onQueryPreviews: async (form) => {
      console.log('[onQuery] form: ', form);
      return toRSS_JSON(sourceMock2).item
    },
    onSubmit: (...args) => {
      console.log('[onSubmit] form: ', args);
    },
    onSelect: v => {
      console.log('[onSelect] select result: ', v);
    },
  });

  return (
    <Sources {...rssSource} all />
  )
}