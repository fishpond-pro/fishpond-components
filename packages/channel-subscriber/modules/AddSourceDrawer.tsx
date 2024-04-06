import { h, SignalProps, PropTypes, useLogic, ConvertToLayoutTreeDraft, VirtualLayoutJSON, createFunctionComponent } from '@polymita/renderer';
import { after, ComputedSignal, Signal, signal } from '@polymita/signal'
import showdown from 'showdown'
import rssSourceDriver from '../signals/rss'
import * as DrawerModule from '@polymita/ui/components/drawer'
import * as InputModule from '@polymita/ui/components/input'
import * as ButtonModule from '@polymita/ui/components/button'
import * as TabsModule from '@polymita/ui/components/tabs'
import * as ListModule from '@polymita/ui/components/list'
import * as RSSPanelsTableModule from './RSSParamsTable'
import { getParamsFromPath } from '../shared/utils';
import { SubscribedChannel, SubscribedChannelWithForm } from '../shared/types';
import { extractParams } from '../shared/utils';

export const name = 'AddSourceDrawer' as const
export let meta: {
  props: AddSourceDrawerProps,
  layoutStruct: AddSourceDrawerLayout
  patchCommands: []
}

type rssSourceDriverReturn = ReturnType<typeof rssSourceDriver>

export interface AddSourceDrawerProps extends rssSourceDriverReturn {
  subscribed: ComputedSignal<SubscribedChannelWithForm[]>
}

export const propTypes = {
}

export const logic = (props: SignalProps<AddSourceDrawerProps>) => {
  const showForm = signal<number[]>([])

  return {
    showForm,
  }
}
type LogicReturn = ReturnType<typeof logic>

export type AddSourceDrawerLayout = {
  type: 'modulesContainer',
  children: [
  ]
}

const Drawer = createFunctionComponent(DrawerModule)
const Input = createFunctionComponent(InputModule)
const Button = createFunctionComponent(ButtonModule)
const RSSTable = createFunctionComponent(RSSPanelsTableModule)
const Tabs = createFunctionComponent(TabsModule)
const TabsPanel = createFunctionComponent(TabsModule.panelModule);
const List = createFunctionComponent(ListModule);

export const layout = (props: AddSourceDrawerProps): VirtualLayoutJSON => {
  const logic = useLogic<LogicReturn>();

  const currentSource = props.currentSource()
  if (!currentSource) {
    return null
  }

  const params = currentSource && getParamsFromPath(currentSource.route.path, currentSource.route.paramsdesc);

  return (
    <Drawer
      closable 
      width={1000} 
      onClose={() => props.selectCurrentSource(null)} 
      title={`${currentSource.group}/${currentSource.subGroup}/${currentSource.title}`} 
      extra={[
        <Button 
          key="submit" disabled={props.showSubmitConfirm().visible}
          onClick={() => props.submit()}
        >submit</Button>,
      ]}
    >
      <Tabs>
        <TabsPanel header="new">
          <sourceParamsTop className="flex flex-col mg-2 h-full">
            <submitConfirmMessage
              if={props.showSubmitConfirm().visible}
              className="flex my-4 p-2 border border-yellow-600 justify-between items-center text-yellow-600"
            >
              <span>
                {props.showSubmitConfirm().title}
              </span>
              <Button onClick={() => props.showSubmitConfirm()} type="primary" >Sure</Button>
            </submitConfirmMessage>
            <rowParams className="flex flex-row h-full relative">
              <leftParams className="flex-1 min-w-0">
                <sourceExtraParamBox className="block p-2 border my-2">
                  <h3 className="mt-2">参数表单</h3>
                  <sourcePreviewForm className="block border-slate-100 mt-2 pd-2">
                    {Object.keys(props.sourcePreviewForm().payload).map((key) => (
                      <sourcePreviewFormItem className="block mb-2" key={key}>
                        <Input 
                          placeholder={key}
                          value={props.sourcePreviewForm as any}
                          value-path={['payload', key]} 
                        />
                      </sourcePreviewFormItem>
                    ))}
                    <fullContentPathLabel className="block mt-4">
                      指定全文内容的路径
                    </fullContentPathLabel>
                    <div className='mt-2'>
                      <Input 
                        placeholder='full content path'
                        value={props.sourcePreviewForm as any}
                        value-path={['fullContentPath']}
                      />
                    </div>
                  </sourcePreviewForm>
                  <sourceParamBoxError className="block mt-2 text-red-500">
                  </sourceParamBoxError>
                  <sourceParamBoxFooter className="flex justify-end mt-2">
                    <div className='mr-2'>
                      <Button key="preview" onClick={() => props.resetSourcePreviewForm()} >rest</Button>
                    </div>
                    <Button key="preview" onClick={() => props.queryPreview()} >preview</Button>
                  </sourceParamBoxFooter>
                </sourceExtraParamBox>
                
                <sourceItemRoute className="block break-all">
                  <span className='mr-1 text-gray-500'>路径:</span>
                  /{currentSource?.route.path}
                </sourceItemRoute>
                <sourceItemRoute if={!!params.length} className="block break-all">
                  <span className='mr-1 text-gray-500'>参数:</span>
                </sourceItemRoute>
                <sourceItemRouteParams if={!!params.length} className="block">
                  {params.map(p => (
                    <sourceItemRouteParam className="flex items-center">
                      <span className="ml-2 inline-block bg-black rounded-full w-[6px] h-[6px]" ></span>
                      <span className="ml-2 px-[4px] py-[2px] bg-slate-100 text-gray-600">{p.name}</span>
                      ,
                      {p.optional ? '可选' : '必选'}
                      ,
                      {p.desc}
                    </sourceItemRouteParam>
                  ))}
                </sourceItemRouteParams>
                {[].concat(currentSource?.tables).filter(Boolean).map((table, index) => {
                  return (
                    <div key={table} className="mt-3">
                      <RSSTable tables={table} />
                    </div>
                  )
                })}
                <sourceItemParamTips className="block mt-2 p-4 bg-slate-200">
                  {currentSource?.tipsMarkDown.map(tip => {
                    const converter = new showdown.Converter();
                    const html = converter.makeHtml(tip);
                    return (
                      <div className="break-all mb-2" _html={html}></div>                    
                    )
                  })}
                </sourceItemParamTips>

            
              </leftParams>
              <arrowSymbol className="flex mx-4 items-center justify-center">
                &gt;
              </arrowSymbol>
              <rightPreviewContainer className="flex-1 relative border border-slate-500 p-2 min-w-0 overflow-auto">
                {props.previewMessages()?.length === 0 ? <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">暂无</span> : ''}
                
                
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

                {props.previewMessages()?.map((m, index) => {
                  return (
                    <pre key={m.title + index} className="p-4 border my-2">
                      {JSON.stringify(m, null, 2)}
                    </pre>
                  )
                })}
              </rightPreviewContainer>
            </rowParams>
          </sourceParamsTop>
        </TabsPanel>
        <TabsPanel header="subscribed">
          {props.subscribed()?.[0]?.rss.map((rssItem, index) => {
            const isShowForm = logic.showForm().includes(rssItem.id)
            const params = extractParams(currentSource.route.path, rssItem.href);

            const displayForm = {
              ...rssItem.payload,
              ...params,
            }

            return (
              <rssListItem className='block'>
                <rssItem className='w-full p-2 flex items-center'>
                  <rssItemName className='flex-1'>
                    {rssItem.name}

                    <a href={rssItem.href} className='ml-2' target='_blank'>{rssItem.href}</a>
                  </rssItemName>
                  <rssItemLink className="ml-2">
                    <rssItemForm className="mr-2" onClick={() =>{
                      logic.showForm(draft => {
                        if (draft.includes(rssItem.id)) {
                          return draft.filter(id => id !== rssItem.id)
                        } else {
                          draft.push(rssItem.id)
                        }
                      })
                    }}>
                      Parameters
                    </rssItemForm>
                    
                  </rssItemLink>
                </rssItem>
                <rssItemFormContent className='block p-4' if={isShowForm}>
                  <pre>
                    {JSON.stringify(displayForm, null, 2)}
                  </pre>
                </rssItemFormContent>
              </rssListItem>
            )
          })}
        </TabsPanel>
      </Tabs>

    </Drawer>
  )
}

export const styleRules = (props: AddSourceDrawerProps, layout: ConvertToLayoutTreeDraft<AddSourceDrawerLayout>) => {
  return [
  ]
}

export const designPattern = (props: AddSourceDrawerProps, layout: ConvertToLayoutTreeDraft<AddSourceDrawerLayout>) => {
  const logic = useLogic<LogicReturn>()
  return {}
}
