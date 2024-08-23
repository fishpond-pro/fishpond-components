'use client'
import * as rs from '@polymita/rss-sources'
import menus from '@/models/rsshub-source-menu.json'
import rsshubSourcesMock from '@/models/rsshub-sources.json'

import * as mo from '../moduleOverride'

const Sources = rs.views.RssSources(mo.modulesLinkMap, mo.modulesActiveMap);

export default () => {

  const rssSource = rs.signals.rss({
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

  return (<div>123</div>)
  return (
    <Sources {...rssSource} all />
  )
}