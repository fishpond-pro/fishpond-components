'use client'
import rssSignal from '@/signals/rss'
import SourcesFn from '../polymita/views/RssSources'
import menus from '@/shared/rsshub-source-menu.json'
import rsshubSourcesMock from '@/shared/rsshub-sources.json'
import * as mo from '../moduleOverride'
import { queryContext } from '@/contexts/QueryContext'
import { useContext } from 'react'

const Sources = SourcesFn(mo.modulesLinkMap, mo.modulesActiveMap);

export default () => {

  const { menus, onQueryRssSources } = useContext(queryContext)
  console.log('menus: ', menus);

  return (
    <>
      <Sources />
    </>
  )
}