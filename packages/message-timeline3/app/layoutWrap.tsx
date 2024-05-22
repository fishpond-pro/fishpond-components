'use client'
import { useMemo } from "react"

import { ConnectProvider } from "@polymita/next-connect"
import mi from '@/models/indexes.json'
import { createPlugin } from './polymita/connect'

export default (props: any) => {
  const plugin = useMemo(() => createPlugin(), [])
  return (
    <ConnectProvider
      modelIndexes={mi}
      plugin={createPlugin()}
    >
      {props.children}
    </ConnectProvider>
  )
}