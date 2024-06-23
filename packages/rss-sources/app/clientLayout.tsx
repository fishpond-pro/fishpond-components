'use client'

import '@polymita/basic-layout/dist/index.css'
import App from '@polymita/basic-layout/dist/views/App'
import '@/app/polymita/views/RssMenuItem'
import { ConnectProvider, PrismaNamespaceProvider } from '@polymita/next-connect'
import mi from '@/models/indexes.json'
import { createPlugin } from './polymita/connect'
import pkg from '../package.json'

export default ({
  children,
}) => {
  return (
    <ConnectProvider
      modelIndexes={mi}
      plugin={createPlugin()}
    >
      <PrismaNamespaceProvider namespace={pkg.name}>
        <App 
          title="Polymita"
          contentChildren={children}
        />
      </PrismaNamespaceProvider>
    </ConnectProvider>
  )
}