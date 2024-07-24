'use client'

import '@polymita/basic-layout/dist/index.css'
import '@polymita/rss-sources/dist/index.css'
import App from '@polymita/basic-layout/dist/views/App'
import '@polymita/rss-sources/dist/views/RssMenuItem'
import { ConnectProvider, PrismaNamespaceProvider } from '@polymita/next-connect'
import mi from '@/models/indexes.json'
import { createPlugin } from './polymita/connect'
import pkg from '../package.json'
import { queryContext } from '@/contexts/QueryContext'
import { toRSS_JSON } from '@/shared/utils'
import sourceMock2 from '@/shared/rss-mock'

export default ({
  children,
}) => {
  return (
    <ConnectProvider
      modelIndexes={mi}
      plugin={createPlugin()}
    >
      <PrismaNamespaceProvider>
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
      </PrismaNamespaceProvider>
    </ConnectProvider>
  )
}