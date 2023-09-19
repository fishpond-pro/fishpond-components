import { createFunctionComponent, h, SignalProps, PropTypes, useLogic, ConvertToLayoutTreeDraft, VirtualLayoutJSON } from '@polymita/renderer';
import { after, Signal, signal } from '@polymita/signal'
import * as DrawerModule from 'polymita/components/drawer'

export const name = 'MessageContent' as const
export let meta: {
  props: MessageContentProps,
  layoutStruct: MessageContentLayout
  patchCommands: []
}

export interface MessageContentProps {
  title?: string;
  description?: string;
  content?: string;
  contentLink?: string

  displayType: 'drawer' | 'modal' | 'normal'

  mode: 'iframe' | 'new-window'
}

export const propTypes = {
}

export const logic = (props: SignalProps<MessageContentProps>) => {
  const showIframe = signal(false);

  return {
    showIframe,
  }
}
type LogicReturn = ReturnType<typeof logic>

export type MessageContentLayout = {
  type: 'modulesContainer',
  children: [
  ]
}

const Drawer = createFunctionComponent(DrawerModule);

export const layout = (props: MessageContentProps): VirtualLayoutJSON => {
  const { mode } = props;

  const logic = useLogic<LogicReturn>();

  const contentNode = (
    <messageContent className='block'>
      <messageContentHeader className='flex items-center justify-between'>
        <messageContentTitle className='text-lg font-bold'>{props.title}</messageContentTitle>
      </messageContentHeader>
      <messageContentBody className='flex flex-col'>
        <messageContentLink className='text-sm text-gray-600 p-4 bg-slate-100 my-2 rounded-sm' >
          <a target='_blank' href={props.contentLink} >{props.contentLink}</a>
        </messageContentLink>
        <messageContentDescription className='text-sm text-gray-600' _html={props.description} />
        <messageContentContent if={!!props.content} className='text-sm text-gray-600' _html={props.content} />
        <messageContentContentFrame if={!props.content} className='text-sm text-gray-600' >
          <iframe src={props.contentLink} className='w-full' />
        </messageContentContentFrame>
      </messageContentBody>
    </messageContent>
  );

  return (
    <modulesContainer className="block ">
      {contentNode}
    </modulesContainer>
  )
}

export const styleRules = (props: MessageContentProps, layout: ConvertToLayoutTreeDraft<MessageContentLayout>) => {
  return [
  ]
}

export const designPattern = (props: MessageContentProps, layout: ConvertToLayoutTreeDraft<MessageContentLayout>) => {
  const logic = useLogic<LogicReturn>()
  return {}
}
