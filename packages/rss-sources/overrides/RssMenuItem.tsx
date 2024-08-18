import { h, SignalProps, useLogic, ConvertToLayoutTreeDraft, CommandOP, extendModule } from '@polymita/renderer';
import * as bl from '@polymita/basic-layout'
import { usePathname } from 'next/navigation';
export interface RssMenuItemProps {
  
}
const NewModule = extendModule(bl.modules.Aside, () => ({
  patchLayout(props: typeof bl.modules.Aside.meta.props & RssMenuItemProps, root) {
    console.log('NewModule: ');
    const logic = useLogic()
    const path = usePathname();

    return [
      {
        op: CommandOP.addChild,
        condition: true,
        target: root.asideContainer.asideMenuContainer,
        child: (<div>Sources</div>)
      },
    ]
  }
}))

export const meta = NewModule.meta
export const base = NewModule.base
export const name = 'RssMenuItem'
export const namespace = NewModule.namespace
//
export const override = NewModule.override
export const layout = NewModule.layout
export const logic = NewModule.logic
export const designPattern = NewModule.designPattern
export const designPatterns = NewModule.designPatterns
export const styleRules = NewModule.styleRules