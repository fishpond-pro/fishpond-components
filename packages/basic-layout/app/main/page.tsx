'use client'
import AppFn from '@/app/polymita/views/App'
import AsideNewForTest from '@/app/polymita/views/AsideNewForTest'
import * as mo from '../moduleOverride';

console.log('modulesLinkMap: ', mo.modulesLinkMap);

AsideNewForTest(mo.modulesLinkMap)
const App = AppFn(mo.modulesLinkMap, mo.modulesActiveMap)

globalThis.POLYMITA_DYNAMIC_ROUTES = [
  {
    path: '/main/a/b/c/d',
    element: <div>a/b/c/d</div>,
    title: 'ABCDE',
    children: [
      {
        path: '/main/a/b/c/d/e',
        element: <div>a/b/c/d/e</div>,
        title: 'ABCDE'
      }
    ]
  }
]

export default () => {
  return (
    <App 
      title="Vesta Test"
    />
  )
}
