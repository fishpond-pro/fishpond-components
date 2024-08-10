'use client'
import AppFn from '@/app/polymita/views/App'
import AsideNewForTest from '@/app/polymita/views/AsideNewForTest'
import * as mo from '../moduleOverride';

console.log('modulesLinkMap: ', mo.modulesLinkMap);

AsideNewForTest(mo.modulesLinkMap)
const App = AppFn(mo.modulesLinkMap, mo.modulesActiveMap)

export default () => {
  return (
    <App 
      title="Vesta Test"
    />
  )
}
