import { h, SignalProps, useLogic, ConvertToLayoutTreeDraft, CommandOP, extendModule } from '@polymita/renderer';
import * as ml from '@polymita/message-list'
import type { MessagesContainerProps } from '@polymita/message-list/dist/modules/MessagesContainer'
import RefreshIcon from '@mui/icons-material/Refresh';

export interface AsideNewForTestProps {
  
}
const NewModule = extendModule(ml.modules.MessagesContainer, () => ({
  patchLayout(props: MessagesContainerProps & AsideNewForTestProps, root) {
    const logic = useLogic()

    return [
      {
        op: CommandOP.addFirst,
        target: root.messagesContainer.messagesContainerTimeline,
        child: (
          <manualTopOperations className='block mb-1'>
            <RefreshIcon className='cursor-pointer'  />
          </manualTopOperations>
        )
      },
    ]
  }
}))

export const meta = NewModule.meta
export const base = NewModule.base
export const name = 'ManualRefresh'
export const namespace = NewModule.namespace
//
export const override = NewModule.override
export const layout = NewModule.layout
export const logic = NewModule.logic
export const designPattern = NewModule.designPattern
export const designPatterns = NewModule.designPatterns
export const styleRules = NewModule.styleRules