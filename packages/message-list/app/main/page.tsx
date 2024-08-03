'use client'

import MessagesContainerFn from '../polymita/views/MessagesContainer'
import * as mo from '../moduleOverride'

const MessagesContainer = MessagesContainerFn(mo.modulesLinkMap, mo.modulesActiveMap)

export default () => {

  return (
    <MessagesContainer 
      mode="iframe"
    />
  )
}
