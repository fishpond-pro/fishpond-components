import '@polymita/basic-layout/dist/index.css'
import * as bl from '@polymita/basic-layout'
import RssMenuItemFn from '@/app/polymita/views/RssMenuItem'
import * as mo from './moduleOverride'

import { Outlet } from 'react-router-dom'

const App = bl.views.App(mo.modulesLinkMap, mo.modulesActiveMap)
RssMenuItemFn(mo.modulesLinkMap)

export default ({
  children,
}) => {
  return (
    // <queryContext.Provider value={{
    //   menus,
    //   onQueryRssSources: async (arg) => {
    //     const r = arg.map(([g, subGroup]) => {
    //       return rsshubSourcesMock.filter(item => 
    //         item.group === g && item.subGroup === subGroup
    //       )
    //     }).flat().map(item => ({
    //       ...item,
    //       tables: typeof item.tables === 'string' ? [item.tables] : item.tables
    //     }));
    //     return r
    //   },
    // }}>
      <App 
        title="Xxxxx"
        contentChildren={<Outlet />}
      />
    // </queryContext.Provider>
  )
}