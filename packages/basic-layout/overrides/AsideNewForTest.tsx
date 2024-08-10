import { h, SignalProps, useLogic, ConvertToLayoutTreeDraft, CommandOP, extendModule } from '@polymita/renderer';
import * as BaseModule from '@/modules/Aside'
export interface AsideNewForTestProps {
  
}
const NewModule = extendModule(BaseModule, () => ({
  patchLayout(props: typeof BaseModule.meta.props & AsideNewForTestProps, root) {
    const logic = useLogic()

    return [
      {
        op: CommandOP.addChild,
        condition: true,
        target: root.asideContainer.asideMenuContainer,
        child: (<div>new child x</div>)
      },
    ]
  }
}))

export const meta = NewModule.meta
export const base = NewModule.base
export const name = 'AsideNew'
export const namespace = NewModule.namespace
//
export const override = NewModule.override
export const layout = NewModule.layout
export const logic = NewModule.logic
export const designPattern = NewModule.designPattern
export const designPatterns = NewModule.designPatterns
export const styleRules = NewModule.styleRules