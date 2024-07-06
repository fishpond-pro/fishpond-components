import { Button } from '@mui/material';
import { h, SignalProps, useLogic, CommandOP, extendModule, ConvertToLayoutTreeDraft2 } from '@polymita/renderer';
import * as BaseModule from '@polymita/rss-sources/dist/modules/RSSSourcePanel2'
import type BaseModuleLayout from '@polymita/rss-sources/dist/modules/RSSSourcePanel2.layout'
import { usePathname } from 'next/navigation';
import CardActions from '@mui/material/CardActions';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

export interface AddRSSSourceProps {
  
}
const NewModule = extendModule(BaseModule, () => ({
  patchLayout(
    props: typeof BaseModule.meta.props & AddRSSSourceProps,
    root: ConvertToLayoutTreeDraft2<BaseModuleLayout.LayoutTypes>
  ) {
    const logic = useLogic()

    const path = usePathname();

    return [
      {
        op: CommandOP.addChild,
        condition: true,
        target: root.Card,
        child: (
          <CardActions>
            <Button size="small">添加</Button>
          </CardActions>
        ),
      },
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