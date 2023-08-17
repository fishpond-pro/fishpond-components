import { h, SignalProps, PropTypes, useLogic, ConvertToLayoutTreeDraft, createFunctionComponent, VirtualLayoutJSON } from '@polymita/renderer';
import * as SourceItemModule from './SourceItem'
import { signal } from '@polymita/signal-model';

import * as DrawerModule from 'polymita/components/drawer'
import * as InputModule from 'polymita/components/input'

import {getParamsFromPath } from '@/utils/index'
import sourceListInnerLogic, { SourceListInnerLogicProps } from '@/drivers/sourceListInnerLogic'


export const name = 'SourceList' as const
export let meta: {
  props: SourceListProps,
  layoutStruct: SourceListLayout
  patchCommands: []
}


export interface SourceListProps extends SourceListInnerLogicProps {
  sources: SourceItemModule.RSSSource[]
  width: number
}

export const propTypes = {
}

const SourceItem = createFunctionComponent(SourceItemModule)
const Drawer = createFunctionComponent(DrawerModule)
const Input = createFunctionComponent(InputModule)

export const logic = (props: SignalProps<SourceListProps>) => {
  
  const r = sourceListInnerLogic(props)

  return {
    ...r,
  }
}
type LogicReturn = ReturnType<typeof logic>

export type SourceListLayout = {
  type: 'sourceListContainer',
  children: [
  ]
}

const COLUMN_WIDTH = 4;

export const layout = (props: SourceListProps): VirtualLayoutJSON => {
  const logic = useLogic<LogicReturn>()

  const columnWidth = props.width / COLUMN_WIDTH

  const currentSource = logic.currentSource()

  const params = currentSource && getParamsFromPath(currentSource.route.path, currentSource.route.paramsdesc)

  return (
    <sourceListContainer className="block">
      <div style={{ columnCount: COLUMN_WIDTH }}>
        {props.sources.map(source => (
          <SourceItem 
            width={columnWidth} 
            key={`${source.group}-${source.subGroup}-${source.title}`}
            value={source}
            onClick={() => {
              logic.currentSource(source)
            }} />
        ))}
      </div>
      {currentSource && (
        <Drawer 
          closable 
          width={1000} 
          onClose={() => logic.selectCurrentSource(null)} 
          title={`${currentSource.group}/${currentSource.subGroup}/${currentSource.title}`} 
        >
          <div className="flex mg-2">            
            <div className="flex-1">
              <sourceItemRoute className="block break-all">
                <span className='mr-1 text-gray-500'>路径:</span>
                /{currentSource.route.path}
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
              <sourcePreviewForm className="block border-slate-100 mt-2 pd-2">
                {Object.entries(logic.sourcePreviewForm().payload).map((key) => (
                  <Input value={logic.sourcePreviewForm() as any} value-path={['payload', key]} />
                ))}
              </sourcePreviewForm>
            </div>
            <div className="flex mx-4 items-center justify-center">
              &gt;
            </div>
            <div className="flex-1 relative">
              {logic.previewMessages().length === 0 ? <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">暂无</span> : ''}
              {logic.previewMessages().map((m, index) => {
                return (
                  <div key={m.title}>
                    {index+1}.{m.title}
                  </div>
                )
              })}
            </div>
          </div>
        </Drawer>
      )}
    </sourceListContainer>
  )
}

export const styleRules = (props: SourceListProps, layout: ConvertToLayoutTreeDraft<SourceListLayout>) => {
  return [
  ]
}

export const designPattern = (props: SourceListProps, layout: ConvertToLayoutTreeDraft<SourceListLayout>) => {
  const logic = useLogic<LogicReturn>()
  return {}
}
