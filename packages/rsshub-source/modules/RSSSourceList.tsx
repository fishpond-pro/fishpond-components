import { classNames, h, SignalProps, PropTypes, useLogic, ConvertToLayoutTreeDraft, createFunctionComponent, VirtualLayoutJSON } from '@polymita/renderer';
import * as RSSSourcePanelModule from './RSSSourcePanel'

import * as DrawerModule from 'polymita/components/drawer'
import * as InputModule from 'polymita/components/input'
import * as ButtonModule from 'polymita/components/button'
import * as RSSPanelsTableModule from './RSSParamsTable'

import {getParamsFromPath } from '@/utils/index'
import sourceListInnerLogic, { SourceListInnerLogicProps } from '@/drivers/sourceListInnerLogic'


export const name = 'SourceList' as const
export let meta: {
  props: SourceListProps,
  layoutStruct: SourceListLayout
  patchCommands: []
}


export interface SourceListProps extends SourceListInnerLogicProps {
  sources: RSSSourcePanelModule.RSSSource[]
  width: number
}

export const propTypes = {
}

const RSSSourcePanel = createFunctionComponent(RSSSourcePanelModule)
const Drawer = createFunctionComponent(DrawerModule)
const Input = createFunctionComponent(InputModule)
const Button = createFunctionComponent(ButtonModule)
const RSSTable = createFunctionComponent(RSSPanelsTableModule)

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
          <RSSSourcePanel 
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
          <sourceParamsTop className="flex flex-col mg-2 h-full">
            <submitConfirmMessage
              if={logic.showSubmitConfirm().visible}
              className="flex mb-2 p-2 border border-yellow-600 justify-between items-center text-yellow-600"
            >
              <span>
                {logic.showSubmitConfirm().title}
              </span>
              <Button onClick={() => logic.showSubmitConfirm()} type="primary" >Sure</Button>
            </submitConfirmMessage>
            <rowParams className="flex flex-row h-full">
              <leftParams className="flex-1 min-w-0">
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
                {[].concat(currentSource.tables).filter(Boolean).map((table, index) => {
                  return (
                    <div key={table} className="mt-3">
                      <RSSTable tables={table} />
                    </div>
                  )
                })}
                <h3 className="mt-2">参数表单</h3>
                <sourcePreviewForm className="block border-slate-100 mt-2 pd-2">
                  {Object.keys(logic.sourcePreviewForm().payload).map((key) => (
                    <sourcePreviewFormItem className="block mb-2" key={key}>
                      <Input 
                        placeholder={key}
                        value={logic.sourcePreviewForm as any}
                        value-path={['payload', key]} 
                      />
                    </sourcePreviewFormItem>
                  ))}
                  <fullContentPathLabel className="block mt-4">
                    指定全文内容的路径
                  </fullContentPathLabel>
                  <Input 
                    placeholder='full content path'
                    value={logic.sourcePreviewForm as any}
                    value-path={['fullContentPath']}
                  />
                </sourcePreviewForm>
              </leftParams>
              <arrowSymbol className="flex mx-4 items-center justify-center">
                &gt;
              </arrowSymbol>
              <rightPreviewContainer className="flex-1 relative border border-slate-500 p-2 min-w-0 overflow-auto">
                {logic.previewMessages()?.length === 0 ? <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">暂无</span> : ''}
                
                
                {/* {logic.previewMessages()?.map((m, index) => {
                  const isExpand = logic.expandablePreviewDescriptions[index];
                  return (
                    <previewMessage key={m.title}>
                      <a href={m.link} className="block mb-2 hover:underline hover:underline-offset-2" target="_blank">
                        {index+1}.{m.title}
                      </a>
                      <previewMessageDescription 
                        className={classNames('px-4 block text-slate-300 relative', { 'line-clamp-2': !isExpand })}
                      >
                        <div _html={m.description}></div>

                        <expandDescription className="absolute right-1 bottom-1" onClick={() => logic.toggleDescriptionExpandable(index)}>
                          { isExpand ? '收起' : '展开'}
                        </expandDescription>
                      </previewMessageDescription>
                    </previewMessage>
                  )
                })} */}

                {logic.previewMessages()?.map((m, index) => {
                  return (
                    <pre key={m.title + index} className="p-4 border my-2">
                      {JSON.stringify(m, null, 2)}
                    </pre>
                  )
                })}
              </rightPreviewContainer>
            </rowParams>
          </sourceParamsTop>
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
