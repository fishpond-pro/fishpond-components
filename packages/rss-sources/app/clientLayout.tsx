'use client'

import '@polymita/basic-layout/dist/index.css'
import * as bl from '@polymita/basic-layout'
import RssMenuItemFn from '@/app/polymita/views/RssMenuItem'
import { PrismaNamespaceProvider } from '@polymita/next-connect'
import pkg from '../package.json'
import * as mo from './moduleOverride'

console.log('mo: ', mo);
const App = bl.views.App(mo.modulesLinkMap, mo.modulesActiveMap)
RssMenuItemFn(mo.modulesLinkMap)

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