import React, { useState } from 'react'

import Message from '../../views/Message'

export default function Main () {

  const [s1, setS1] = useState(0)

  return (
    <div>
      <div style={{ width: '300px', margin: '10px' }}>
        <Message name="消息标题" />
      </div>
    </div>
  )
}
