import { h, SignalProps, useLogic, ConvertToLayoutTreeDraft, CommandOP, extendModule } from '@polymita/renderer';
import * as BaseModule from '@polymita/rss-sources/dist/modules/RSSSourcePanel2'
import { usePathname } from 'next/navigation';
export interface AddRSSSourceProps {
  
}
const NewModule = extendModule(BaseModule, () => ({
  patchLayout(props: typeof BaseModule.meta.props & AddRSSSourceProps, root) {
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
export const name = 'AddRSSSource'
export const namespace = NewModule.namespace
//
export const override = NewModule.override
export const layout = NewModule.layout
export const logic = NewModule.logic
export const designPattern = NewModule.designPattern
export const designPatterns = NewModule.designPatterns
export const styleRules = NewModule.styleRules