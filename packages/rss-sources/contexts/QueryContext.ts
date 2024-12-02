import React from 'react'
import { RSSSource } from '@/shared/utils'
import { SourceMenus } from '@/signals/rss'

export const queryContext = React.createContext<{
  /**
   * @name 查询预览
   */
  onQueryRssSources?: (v: [string, string][]) => Promise<RSSSource[]>

  menus: SourceMenus
}>(null)