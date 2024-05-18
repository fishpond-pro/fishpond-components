'use client'
import App from '@/app/polymita/views/App'
import '@/app/polymita/views/AsideNewForTest'
import { modulesLinkMap } from '@/common/moduleOverride';

console.log('modulesLinkMap: ', modulesLinkMap);

export default () => {
  return (
    <App />
  )
}