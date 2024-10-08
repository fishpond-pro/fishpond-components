'use client'

import App from '@polymita/basic-layout/dist/views/App'
import '@polymita/rss-sources/dist/views/RssMenuItem'
import { PrismaNamespaceProvider } from '@polymita/next-connect'

export default ({
  children,
}) => {
  return (
    <PrismaNamespaceProvider>
      <App 
        title="Polymita"
        contentChildren={children}
      />
    </PrismaNamespaceProvider>
  )
}