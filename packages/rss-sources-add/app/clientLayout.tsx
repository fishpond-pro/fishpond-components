'use client'

import '@polymita/basic-layout/dist/index.css'
import '@polymita/rss-sources/dist/index.css'
import AppFn from '@polymita/basic-layout/dist/views/App'
import * as rs from '@polymita/rss-sources'
import { ConnectProvider, PrismaNamespaceProvider } from '@polymita/next-connect'
import mi from '@/models/indexes.json'
import { createApiPlugin } from '@polymita/next-connect'
import pkg from '../package.json'
import { queryContext } from '@/contexts/QueryContext'
import { toRSS_JSON } from '@/shared/utils'
import sourceMock2 from '@/shared/rss-mock'
import AddRSSSourceFn from '@/app/polymita/views/AddRSSSource'
import * as mo from './moduleOverride'

AddRSSSourceFn(mo.modulesLinkMap)
rs.views.RssMenuItem(mo.modulesLinkMap, mo.modulesActiveMap)
const App = AppFn(mo.modulesLinkMap, mo.modulesActiveMap);

export default ({
  children,
}) => {
  return (
    <ConnectProvider
      modelIndexes={mi}
      plugin={createApiPlugin()}
    >
      <queryContext.Provider
        value={{
          onQueryPreviews: async (url) => {
            console.log('[onQuery] url: ', url);
            return toRSS_JSON(sourceMock2).item
          },        
          onSubmit: async (url) => {
            console.log('[onSubmit] url: ', url);
          },        
        }}
      >
        <App 
          title="Polymita"
          contentChildren={children}
        />
      </queryContext.Provider>
    </ConnectProvider>
  )
}