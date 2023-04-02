import { h, SignalProps, useLogic, ConvertToLayoutTreeDraft, CommandOP, overrideModule } from '@polymita/renderer';
import { after, signal } from '@polymita/signal'
import * as BaseModule from './Message'
export interface MessageDirectionProps {
  
}
const NewModule = overrideModule(BaseModule, {
  layout (props: typeof BaseModule.meta.props & MessageDirectionProps, layoutDraft) {
  },
  patchRules (props: typeof BaseModule.meta.props & MessageDirectionProps, root) {
    return []
  },
  patchLayout(props: typeof BaseModule.meta.props & MessageDirectionProps, root) {
    return [
    ]
  }
});

export const meta = NewModule.meta
export const name = NewModule.name
export const override = NewModule.override
export const layout = NewModule.layout
export const logic = NewModule.logic
export const designPattern = NewModule.designPattern
export const designPatterns = NewModule.designPatterns
export const styleRules = NewModule.styleRules