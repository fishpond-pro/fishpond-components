import React from 'react'
import type { PreviewMessage } from '@polymita/rss-sources/dist/signals/signals/rss'

export const queryContext = React.createContext<{
  /**
   * @name 查询预览
   */
  onQueryPreviews?: (v: string) => Promise<PreviewMessage[]>
}>(null)