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
  const logic = useLogic<LogicReturn>()
  const { route } = props.value
  const params = getParamsFromPath(route.path, route.paramsdesc)
  return (
    h('sourceItemContainer', { class: 'inline-block border mb-2 p-4 w-[300px]' },
      h('sourceItemTitle', { class: 'block mb-2 pb-2 border-b' }, props.value.title),
      h('sourceItemRoute', { class: 'block break-all' }, 
        h ('span', { className: 'mr-1 text-gray-500' }, '路由:'),
        props.value.route.path
      ),
      h('sourceItemRoute', { class: 'block break-all' }, 
        h ('span', { className: 'mr-1 text-gray-500' }, '参数:'),
      ),
      h('sourceItemRouteParams', { class: 'block' },
        params.map(p => h('sourceItemRouteParam', { class: 'block' },
          h('span', { className: 'px-[4px] py-[2px] bg-slate-100 text-gray-600' }, p.name),
          ',',
          p.optional ? '可选' : '必选',
          ',',
          p.desc
        ))
      )
    )
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
