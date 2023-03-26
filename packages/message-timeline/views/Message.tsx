import React, { } from 'react'
import * as MessageModule from '../modules/Message'
import { createRSRender } from '@polymita/renderer'

const renderer = createRSRender(MessageModule, {
  framework: {
    name: 'react',
    lib: React
  }
})

const RenderMessage = (props: MessageModule.MessageProps) => {
  const r = renderer.construct(props)
  return renderer.render()
}

export default RenderMessage;
