import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { h, SignalProps, useLogic, CommandOP, extendModule, ConvertToLayoutTreeDraft2 } from '@polymita/renderer';
import * as BaseModule from '@polymita/rss-sources/dist/modules/RSSSourcePanel2'
import type BaseModuleLayout from '@polymita/rss-sources/dist/modules/RSSSourcePanel2.layout'
import { usePathname } from 'next/navigation';
import CardActions from '@mui/material/CardActions';
import Drawer from '@mui/material/Drawer';
import { useState } from 'react';
import { getParamsFromPath } from '@/shared/utils'

export interface AddRSSSourceProps {
  
}
const NewModule = extendModule(BaseModule, () => ({
  patchLogic(
    props: typeof BaseModule.meta.props & AddRSSSourceProps,
    prevLogicResult: ReturnType<typeof BaseModule.logic>,
  ) {
    const [drawerVisible, setDrawerVisible] = useState(false)
    return {
      ...prevLogicResult,
      drawerVisible,
      setDrawerVisible,
    }
  },
  patchLayout(
    props: typeof BaseModule.meta.props & AddRSSSourceProps,
    root: ConvertToLayoutTreeDraft2<BaseModuleLayout.LayoutTypes>
  ) {
    const { setDrawerVisible, drawerVisible } = useLogic()
    console.log('drawerVisible: ', drawerVisible);

    const path = usePathname();

    const { value } = props
    const { route, subGroup, title, tables } = value
    console.log('route, subGroup: ', value);
  
    const params = getParamsFromPath(route.path, route.paramsdesc)
    console.log('params: ', params);
    

    return [
      {
        op: CommandOP.addChild,
        target: root.Card,
        child: (
          <CardActions>
            <Button size="small" onClick={(e) => {
              setDrawerVisible(v => !v)
            }}>添加</Button>
          </CardActions>
        ),
      },
      {
        op: CommandOP.addChild,
        target: root.Card,
        child: (
          <Drawer
            anchor='right'
            open={drawerVisible}
            onClose={() => {
              setDrawerVisible(false)
            }}
            className='p-2'
          >
            <addBox className="px-4">
              <addTitle className="block py-2 w-[50vw]">
                {subGroup} - {title}
              </addTitle>
              <Divider />
              <addContent className="block py-2">
                
              </addContent>
            </addBox>
          </Drawer>
        )
      }
    ]
  }
}))

export const meta = NewModule.meta
export const base = NewModule.base
export const name = 'AddRSSSource'
export const namespace = NewModule.namespace
//
export const override = NewModule.override
export const layout = NewModule.layout
export const logic = NewModule.logic
export const designPattern = NewModule.designPattern
export const designPatterns = NewModule.designPatterns
export const styleRules = NewModule.styleRules