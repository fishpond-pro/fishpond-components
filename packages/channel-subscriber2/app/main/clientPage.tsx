'use client'
import { IHookContext } from '@polymita/signal';
import React, { FC, useContext, useState } from 'react';
import View from '../polymita/views/ChannelList'
import channel from '@/signals/channel'

interface ClientMainProps {
}
const ClientMain: FC<ClientMainProps> = (props) => {
  console.log('ClientMain: ');
  
  const source = channel()
  
  return (
    <View
      internalModal
      list={source.computedChannels}
      title="sources"
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