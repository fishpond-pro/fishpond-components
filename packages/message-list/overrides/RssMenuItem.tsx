import { h, SignalProps, useLogic, ConvertToLayoutTreeDraft, CommandOP, extendModule, VirtualLayoutJSON } from '@polymita/renderer';
import * as bl from '@polymita/basic-layout'
import { usePathname } from 'next/navigation';
import { Link } from 'react-router-dom'

export interface AsideNewProps {
  
}
const NewModule = extendModule(bl.modules.Aside, () => ({
  patchLayout(props: typeof bl.modules.Aside.meta.props & AsideNewProps, root) {
    const logic = useLogic()

    const path = usePathname();

    return [
      {
        op: CommandOP.addChild,
        condition: true,
        target: root.asideContainer.asideMenuContainer,
        child: (<asideMessageListMenuItem className='block mt-4'>
          <Link to="all">All Messages</Link>
          </asideMessageListMenuItem>),
      },
    ]
  }
}))

export const meta = NewModule.meta
export const base = NewModule.base
export const name = 'MessageListRssMenuItem'
export const namespace = NewModule.namespace
//
export const override = NewModule.override
export const layout = NewModule.layout
export const logic = NewModule.logic
export const designPattern = NewModule.designPattern
export const designPatterns = NewModule.designPatterns
export const styleRules = NewModule.styleRules