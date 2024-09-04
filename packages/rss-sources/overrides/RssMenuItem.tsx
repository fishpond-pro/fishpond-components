import { h, SignalProps, useLogic, ConvertToLayoutTreeDraft, CommandOP, extendModule } from '@polymita/renderer';
import * as bl from '@polymita/basic-layout'
import { usePathname } from 'next/navigation';
import { Link } from 'react-router-dom'
export interface RssMenuItemProps {
  
}
const NewModule = extendModule(bl.modules.Aside, () => ({
  patchLayout(props: typeof bl.modules.Aside.meta.props & RssMenuItemProps, root) {
    const logic = useLogic()
    const path = usePathname();

    return [
      {
        op: CommandOP.addChild,
        condition: true,
        target: root.asideContainer.asideMenuContainer,
        child: (<asideSourcesMenuItem className='block mt-4'><Link to="/sources" >Sources</Link></asideSourcesMenuItem>)
      },
    ]
  }
}))

export const meta = NewModule.meta
export const base = NewModule.base
export const name = 'RssSourcesRssMenuItem'
export const namespace = NewModule.namespace
//
export const override = NewModule.override
export const layout = NewModule.layout
export const logic = NewModule.logic
export const designPattern = NewModule.designPattern
export const designPatterns = NewModule.designPatterns
export const styleRules = NewModule.styleRules