'use client'

import '@polymita/basic-layout/dist/index.css'
import AppFn from '@polymita/basic-layout/dist/views/App'

import RssMenuItemFn from '@/app/polymita/views/RssMenuItem'
import { ConnectProvider } from '@polymita/next-connect'

import mi from '@/models/indexes.json'
import { createApiPlugin } from '@polymita/next-connect'
import pkg from '../package.json'
import { toRSS_JSON } from '@/shared/utils'
import sourceMock2 from '@/shared/rss-mock'
import * as mo from './moduleOverride'

RssMenuItemFn(mo.modulesLinkMap)
const App = AppFn(mo.modulesLinkMap, mo.modulesActiveMap);


export default ({
  children,
}) => {
  return (
    <App 
      title="Polymita"
      contentChildren={children}
    />
)
}