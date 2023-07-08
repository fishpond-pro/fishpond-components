import { h, SignalProps, PropTypes, useLogic, ConvertToLayoutTreeDraft } from '@polymita/renderer';
import { after, Signal, signal } from '@polymita/signal'

export const name = 'SourceItem' as const
export let meta: {
  props: SourceItemProps,
  layoutStruct: SourceItemLayout
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
}

export interface SourceItemProps {
  value: RSSSource
  width: number
  onClick: (target: RSSSource) => void
}

export const propTypes = {
}

export const logic = (props: SignalProps<SourceItemProps>) => {
  return {
  }
}
type LogicReturn = ReturnType<typeof logic>

export type SourceItemLayout = {
  type: 'sourceItemContainer',
  children: [
  ]
}

function getParamsFromPath(path: string, desc?: string[]) {
  const params = path.split('/').filter(p => p.trim().startsWith(':'))
  return params.map((p, index) => {
    const optional = /\?$/.test(p)
    return {
      name: optional ? p.slice(1, -1) : p.slice(1),
      optional,
      desc: desc?.[index]
    }
  })
}

export const layout = (props: SourceItemProps) => {
  const logic = useLogic<LogicReturn>();
  
  const { width, value } = props
  const { route, subGroup, title } = value
  const { path, paramsdesc } = route
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
        <span className='mr-1 text-gray-500'>路由:</span>
        /{path}
      </sourceItemRoute>
      <sourceItemRoute className="block break-all">
        <span className='mr-1 text-gray-500'>参数:</span>
      </sourceItemRoute>
      <sourceItemRouteParams className="block">
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

export const styleRules = (props: SourceItemProps, layout: ConvertToLayoutTreeDraft<SourceItemLayout>) => {
  return [
  ]
}

export const designPattern = (props: SourceItemProps, layout: ConvertToLayoutTreeDraft<SourceItemLayout>) => {
  const logic = useLogic<LogicReturn>()
  return {}
}
