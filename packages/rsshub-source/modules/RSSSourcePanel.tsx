import { h, SignalProps, PropTypes, useLogic, ConvertToLayoutTreeDraft } from '@polymita/renderer';
import { after, Signal, signal } from '@polymita/signal'
import { getParamsFromPath } from '@/utils/index';

export const name = 'RSSSourcePanel' as const
export let meta: {
  props: RSSSourcePanelProps,
  layoutStruct: RSSSourcePanelLayout
  patchCommands: []
}

export interface RSSSource {
  group: string
  subGroup: string
  title: string
  route: {
    author: string
    example: string,
    path: string,
    radar?: boolean,
    rssbud?: boolean
    paramsdesc?: string[]
  },
  tipsMarkDown: string[]
  tables?: string[]
}

export interface RSSSourcePanelProps {
  value: RSSSource
  width: number
  onClick?: (target: RSSSource) => void
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
  
  const { width, value } = props
  const { route, subGroup, title } = value
  const { path } = route
  const params = getParamsFromPath(route.path, route.paramsdesc)
  return (
    <sourceItemContainer
      onClick={() => {
        props.onClick?.(value)
      }}
      className="cursor-pointer inline-block box-border border mb-2 p-4" style={{ width: width || 200 }}>
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

