'use client'

import { RSSItem, RSSSource } from '../shared/utils'
export type { RSSItem, RSSSource } from '../shared/utils'
import { getParamsFromPath } from '@/shared/utils';
import menusLogic from './menusLogic'
import { SubscribedChannelWithForm } from '../shared/types'
import { useEffect, useMemo, useState } from 'react';

export interface PreviewMessage extends RSSItem{  
}

export type SourceMenus = Array<{
  title: string
  children: string[]
}>

export interface RssSourceProps {
  onQueryRssSources: (arg: [string, string][]) => Promise<RSSSource[]>
  onSelect: (v: [string, string][]) => void
  menus: SourceMenus
  subscribed: SubscribedChannelWithForm[]
}

export default function rss (props: RssSourceProps) {
  const menus = menusLogic({
    onSelect: props.onSelect,
    menus: props.menus,
  })

  const [allRSSSources, setAllRSSSources] = useState([])
  useEffect(function () {
    const rows = menus.selectedSubGroups;
    if (rows.length !== 0) {
      props.onQueryRssSources(rows).then(json => {
        setAllRSSSources(json)
      });
    };
  }, [menus.selectedSubGroups])

  return {
    menus,
    allRSSSources,
  }
};