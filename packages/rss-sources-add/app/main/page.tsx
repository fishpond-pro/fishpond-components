'use client'
import rssSignal from '@polymita/rss-sources/dist/signals/rss'
import Sources from '@polymita/rss-sources/dist/views/RssSources'
import menus from '@/models/rsshub-source-menu.json'
import rsshubSourcesMock from '@/models/rsshub-sources.json'
import '@/app/polymita/views/AddRSSSource'

export default () => {

  const rssSource = rssSignal({
    subscribed: [],
    menus,
    onQueryRssSources: async (arg) => {
      console.log('[onQueryRssSources] arg: ', arg);
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
  });

  return (
    <Sources {...rssSource} all />
  )
}