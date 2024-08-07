import { createFunctionComponent, h, SignalProps, PropTypes, useLogic, ConvertToLayoutTreeDraft, VirtualLayoutJSON } from '@polymita/renderer';
import { useState } from 'react';

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

  mode: 'iframe' | 'webview'
}

export const propTypes = {
}

export const logic = (props: MessageContentProps) => {
  const [showIframe] = useState(false);

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

export const layout = (props: MessageContentProps): VirtualLayoutJSON => {
  const { mode } = props;

  const logic = useLogic<LogicReturn>();

  return (
    <modulesContainer className="block h-full">
      <messageContent className='h-full message-content p-10 py-4 flex flex-col'>
        <messageContentHeader className='flex items-center justify-between mb-6'>
          <messageContentTitle className='text-2xl font-bold'>{props.title}</messageContentTitle>
        </messageContentHeader>
        <messageContentBody className='flex flex-col flex-1'>
          {/* <messageContentLink className='text-sm text-gray-600 p-4 bg-slate-100 my-2 rounded-sm' >
            <a target='_blank' href={props.contentLink} >{props.contentLink}</a>
          </messageContentLink>
          <messageContentDescription className='text-base rounded leading-8 text-gray-600 ' _html={props.description} />
          <messageContentContent if={!!props.content} className='text-base leading-8 text-gray-600' _html={props.content} /> */}
          <messageContentContentFrame if={!props.content} className='flex text-base leading-8 text-gray-600 flex-1' >
            <iframe if={mode === 'iframe'} id={props.contentLink} src={props.contentLink} className='w-full h-full' />
            <webview if={mode === 'webview'} id={props.contentLink} src={props.contentLink} className='w-full flex-1' />
          </messageContentContentFrame>
        </messageContentBody>
      </messageContent>
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
