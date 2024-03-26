'use client'
import { IHookContext } from '@polymita/signal';
import React, { FC, useContext, useState } from 'react';
import View from '../polymita/views/ChannelList'
import { useSignal } from '../polymita/hooks';
import { signalMap } from '../polymita/signalsMap'

interface ClientMainProps {
  ctx: IHookContext
}
const ClientMain: FC<ClientMainProps> = (props) => {
  
  const source = useSignal(props.ctx, signalMap.channel)
  
  return (
    <View
      internalModal
      list={source.computedChannels}
      title="订阅源" 
      onSubmit={(arg) => {
        source.addRssChannel(arg)
      }}
      onClick={(item, i) => {
        console.log('item: ', i, item);
      }}
    />
  )
}

export default ClientMain;