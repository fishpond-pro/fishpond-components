'use client'

import '@polymita/basic-layout/dist/index.css'
import App from '@polymita/basic-layout/dist/views/App'
import '@/app/polymita/views/RssMenuItem'

export default ({
  children,
}) => {
  return (
    <App 
      title="Polymita"
      contentChildren={children}
    />
  )
}