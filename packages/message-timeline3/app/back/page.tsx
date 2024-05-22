import React from 'react'
import '@polymita/ui/index.css'
import writeMessage from '../polymita/signals/writeMessage'
import { getContext } from '../polymita/connect'
import Client from './client'

export default async function Main () {

  return (
    <> 
      <Client />
    </>
  )
}