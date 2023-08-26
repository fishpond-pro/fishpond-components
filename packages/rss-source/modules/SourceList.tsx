import { h, SignalProps, PropTypes, useLogic, ConvertToLayoutTreeDraft, createFunctionComponent, VirtualLayoutJSON } from '@polymita/renderer';
import * as SourceItemModule from './SourceItem'

import * as DrawerModule from 'polymita/components/drawer'
import * as InputModule from 'polymita/components/input'
import * as ButtonModule from 'polymita/components/button'
import * as RSSTableModule from './RSSTable'

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
const Button = createFunctionComponent(ButtonModule)
const RSSTable = createFunctionComponent(RSSTableModule)

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
  console.log('currentSource: ', currentSource);

  const params = currentSource && getParamsFromPath(currentSource.route.path, currentSource.route.paramsdesc)

  console.log('logic.previewMessages(): ', logic.sourcePreviewForm().payload);

  return (
    <sourceListContainer className="block">
      <div style={{ columnCount: COLUMN_WIDTH }}>
        {props.sources.map(source => (
          <SourceItem 
            width={columnWidth} 
            key={`${source.group}-${source.subGroup}-${source.title}`}
            value={source}
            onClick={() => {
              logic.selectCurrentSource(source)
            }} />
        ))}
      </div>
      {currentSource && (
        <Drawer 
          closable 
          width={1000} 
          onClose={() => logic.selectCurrentSource(null)} 
          title={`${currentSource.group}/${currentSource.subGroup}/${currentSource.title}`} 
          extra={[
            <Button key="preview" onClick={() => logic.queryPreview()} >preview</Button>,
            <Button 
              key="submit" disabled={logic.showSubmitConfirm().visible}
              onClick={() => logic.submit()}
            >submit</Button>,
          ]}
        >
          <div className="flex flex-col mg-2">
            <submitConfirmMessage
              if={logic.showSubmitConfirm().visible}
              className="flex mb-2 p-2 border border-yellow-600 justify-between items-center text-yellow-600"
            >
              <span>
                {logic.showSubmitConfirm().title}
              </span>
              <Button onClick={() => logic.showSubmitConfirm()} type="primary" >Sure</Button>
            </submitConfirmMessage>
            <div className="flex flex-row">
              <div className="flex-1 min-w-0">
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
                {currentSource.tables.map((table, index) => (
                  <div className="mt-3">
                    <RSSTable  key={table[0]} tables={table} />
                  </div>
                ))}
                <h3 className="mt-2">参数表单</h3>
                <sourcePreviewForm className="block border-slate-100 mt-2 pd-2">
                  {Object.keys(logic.sourcePreviewForm().payload).map((key) => (
                    <div className="mb-2">
                      <Input 
                        placeholder={key}
                        value={logic.sourcePreviewForm as any}
                        onInput={v => {
                        }}
                        value-path={['payload', key]} 
                      />
                    </div>
                  ))}
                </sourcePreviewForm>
              </div>
              <div className="flex mx-4 items-center justify-center">
                &gt;
              </div>
              <div className="flex-1 relative border border-slate-500 p-2">
                {logic.previewMessages()?.length === 0 ? <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">暂无</span> : ''}
                {logic.previewMessages()?.map((m, index) => {
                  return (
                    <a href={m.link} target="_blank">
                      <previewMessage className="block mb-2 hover:underline hover:underline-offset-2" key={m.title}>
                        {index+1}.{m.title}
                      </previewMessage>
                    </a>
                  )
                })}
              </div>
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
