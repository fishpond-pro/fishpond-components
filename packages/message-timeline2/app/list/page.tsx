import React from 'react'
import '@polymita/ui/index.css'
import message from '../polymita/signals/message'
import { getContext } from '../polymita/connect'
import Client from './client'

export default async function Main () {

  const [_, sourceCtx] = await getContext(message)

  return (
    <> 
      <Client ctx={sourceCtx} />
    </>
  )
}