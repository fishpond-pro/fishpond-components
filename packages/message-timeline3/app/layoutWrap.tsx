'use client'
import { useMemo } from "react"

import { ConnectProvider, PrismaNamespaceProvider } from "@polymita/next-connect"
import mi from '@/models/indexes.json'
import { createPlugin } from './polymita/connect'
import pkg from '../package.json'

export default (props: any) => {
  const plugin = useMemo(() => createPlugin(), [])
  return (
    <ConnectProvider
      modelIndexes={mi}
      plugin={plugin}
    >
      <PrismaNamespaceProvider namespace={''}>
        {props.children}
      </PrismaNamespaceProvider>
    </ConnectProvider>
  )
}