import { h, SignalProps, PropTypes, useLogic, ConvertToLayoutTreeDraft } from '@polymita/renderer';
import { getParamsFromPath } from '@/utils/index';
import type { RSSSource } from '@/shared/utils';

export const name = 'RSSSourcePanel' as const
export let meta: {
  props: RSSSourcePanelProps,
  layoutStruct: RSSSourcePanelLayout
  patchCommands: []
}
export interface RSSSourcePanelProps {
  value: RSSSource
  width: number
  onClick?: (target: RSSSource) => void
  count?: number
}

export const propTypes = {
}

export const logic = (props: SignalProps<RSSSourcePanelProps>) => {
  return {
  }
}
type LogicReturn = ReturnType<typeof logic>

export type RSSSourcePanelLayout = {
  type: 'sourceItemContainer',
  children: [
  ]
}

export const layout = (props: RSSSourcePanelProps) => {
  const logic = useLogic<LogicReturn>();
  
  const { width, value, count } = props
  const { route, subGroup, title } = value
  const { path } = route
  const params = getParamsFromPath(route.path, route.paramsdesc)
  return (
    <sourceItemContainer
      onClick={() => {
        props.onClick?.(value)
      }}
      className="relative cursor-pointer inline-block box-border border mb-2 p-4" style={{ width: width || 200 }}>
      <sourceItemCount 
        if={!!count} 
        className='inline-block bg-slate-300 w-5 h-5 text-center leading-5 text-sm absolute -top-1 -left-1 rounded-full border'>
        {count}
      </sourceItemCount>  
      <sourceItemTitle className="mb-2 pb-2 border-b flex items-center" >
        <span className="inline-block text-ellipsis whitespace-nowrap overflow-hidden">{subGroup}</span>
        <span className="mx-1" >-</span>
        <span className="flex-1 whitespace-nowrap" >{title}</span>
      </sourceItemTitle>
      <sourceItemRoute className="block break-all">
        <span className='mr-1 text-gray-500'>路径:</span>
        /{path}
      </sourceItemRoute>
      <sourceItemRoute if={!!params.length} className="block break-all">
        <span className='mr-1 text-gray-500'>参数:</span>
      </sourceItemRoute>
      <sourceItemRouteParams if={!!params.length} className="block">
        {params.map(p => (
          <sourceItemRouteParam className="block">
            <span className="px-[4px] py-[2px] bg-slate-100 text-gray-600">{p.name}</span>
            ,
            {p.optional ? '可选' : '必选'}
            ,
            {p.desc}
          </sourceItemRouteParam>
        ))}
      </sourceItemRouteParams>
    </sourceItemContainer>
  )
}

export const styleRules = (props: RSSSourcePanelProps, layout: ConvertToLayoutTreeDraft<RSSSourcePanelLayout>) => {
  return [
  ]
}

export const designPattern = (props: RSSSourcePanelProps, layout: ConvertToLayoutTreeDraft<RSSSourcePanelLayout>) => {
  const logic = useLogic<LogicReturn>()
  return {}
}

