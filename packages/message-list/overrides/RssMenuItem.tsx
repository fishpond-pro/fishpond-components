import { h, SignalProps, useLogic, ConvertToLayoutTreeDraft, CommandOP, extendModule, VirtualLayoutJSON } from '@polymita/renderer';
import * as BaseModule from '@polymita/basic-layout/dist/modules/Aside'
import { usePathname } from 'next/navigation';
export interface AsideNewProps {
  
}
const NewModule = extendModule(BaseModule, () => ({
  patchLayout(props: typeof BaseModule.meta.props & AsideNewProps, root) {
    const logic = useLogic()

    const path = usePathname();

    return [
      {
        op: CommandOP.addChild,
        condition: true,
        target: root.asideContainer.asideMenuContainer,
        child: (<div>All Messages</div>) as VirtualLayoutJSON
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