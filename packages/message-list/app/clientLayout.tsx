'use client'

import '@polymita/basic-layout/dist/index.css'
import AppFn from '@polymita/basic-layout/dist/views/App'

import RssMenuItemFn from '@/app/polymita/views/RssMenuItem'
import { ConnectProvider, PrismaNamespaceProvider } from '@polymita/next-connect'

import mi from '@/models/indexes.json'
import { createPlugin } from './polymita/connect'
import pkg from '../package.json'
import { queryContext } from '@/contexts/QueryContext'
import { toRSS_JSON } from '@/shared/utils'
import sourceMock2 from '@/shared/rss-mock'
import * as mo from './moduleOverride'

RssMenuItemFn(mo.modulesLinkMap)
const App = AppFn(mo.modulesLinkMap, mo.modulesActiveMap);


export default ({
  children,
}) => {
  return (
    <ConnectProvider
      modelIndexes={mi}
      plugin={createPlugin()}
    >
      <PrismaNamespaceProvider namespace="">
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