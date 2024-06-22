import React, { useEffect, useRef } from 'react'
import '@polymita/ui/index.css'
import ClientSources from './clientPage'

export default async function Sources () {

  return (
    <div className='flex h-screen w-full'>
      <ClientSources
      />
    </div>
  )
}