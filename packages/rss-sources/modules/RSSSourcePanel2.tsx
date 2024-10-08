import { h, SignalProps, PropTypes, useLogic, ConvertToLayoutTreeDraft, VirtualLayoutJSON } from '@polymita/renderer';
import { getParamsFromPath } from '@/shared/utils';
import type { RSSSource } from '@/shared/utils';
import { Card } from '@mui/material';
import { CardContent } from '@mui/material';

export const name = 'RSSSourcePanel2' as const
export const namespace = 'components' as const
export const base = undefined
export let meta: {
  props: RSSSourcePanel2Props,
  layoutStruct: RSSSourcePanel2Layout
  patchCommands: []
}

export interface RSSSourcePanel2Props {
  value: RSSSource
  width: number | string
  onClick?: (target: RSSSource) => void
  count?: number
}

export const propTypes = {
}

export const logic = (props: SignalProps<RSSSourcePanel2Props>) => {
  return {
  }
}
type LogicReturn = ReturnType<typeof logic>

export type RSSSourcePanel2Layout = {
  type: 'sourceItemContainer',
  children: [
  ]
}

export const layout = (props: RSSSourcePanel2Props): VirtualLayoutJSON => {
  const logic = useLogic<LogicReturn>();
  
  const { width, value, count } = props
  const { route, subGroup, title } = value
  const { path } = route
  const params = getParamsFromPath(route.path, route.paramsdesc)
  return (
    <Card style={{ width: width || 200 }}>
      <CardContent>
        <sourceItemCount 
          if={!!count} 
          className='inline-block bg-slate-300 w-6 h-6 text-center leading-5 text-sm absolute -top-2 -left-2 rounded-full border'>
          {count}
        </sourceItemCount>  
        <sourceItemTitle className="mb-2 pb-2 border-b flex items-center" >
          <span className="inline-block text-ellipsis whitespace-nowrap overflow-hidden">{subGroup}</span>
          <span className="mx-1" >-</span>
          <span className="flex-1 whitespace-nowrap" >{title}</span>
        </sourceItemTitle>
        <sourceItemRoute className="block break-all text-ellipsis line-clamp-2 h-[48px]">
          /{path}
        </sourceItemRoute>
        {/* <sourceItemRoute if={!!params.length} className="block break-all">
          <span className='mr-1 text-gray-500'>参数:</span>
        </sourceItemRoute>
        <sourceItemRouteParams if={!!params.length} className="block">1
          {params.map(p => (
            <sourceItemRouteParam className="block">
              <span className="px-[4px] py-[2px] bg-slate-100 text-gray-600">{p.name}</span>
              ,
              {p.optional ? '可选' : '必选'}
              ,
              {p.desc}
            </sourceItemRouteParam>
          ))}
        </sourceItemRouteParams> */}
      </CardContent>
    </Card>
  )
}

export const styleRules = (props: RSSSourcePanel2Props, layout: ConvertToLayoutTreeDraft<RSSSourcePanel2Layout>) => {
  return [
  ]
}

export const designPattern = (props: RSSSourcePanel2Props, layout: ConvertToLayoutTreeDraft<RSSSourcePanel2Layout>) => {
  const logic = useLogic<LogicReturn>()
  return {}
}

