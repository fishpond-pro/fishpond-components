'use client'

import '@polymita/basic-layout/dist/index.css'
import AppFn from '@polymita/basic-layout/dist/views/App'
import '@/app/polymita/views/RssMenuItem'
import { PrismaNamespaceProvider } from '@polymita/next-connect'
import pkg from '../package.json'
import * as mo from './moduleOverride'

const App = AppFn(mo.modulesLinkMap, mo.modulesActiveMap)

export default ({
  children,
}) => {
  return (
    <PrismaNamespaceProvider namespace={pkg.name}>
      <App 
        title="Polymita"
        contentChildren={children}
      />
    </PrismaNamespaceProvider>
  )
}