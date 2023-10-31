import { classNames, h, SignalProps, PropTypes, useLogic, ConvertToLayoutTreeDraft, createFunctionComponent, VirtualLayoutJSON, classnames } from '@polymita/renderer';
import showdown from 'showdown'
import * as RSSSourcePanelModule from './RSSSourcePanel'
import * as DrawerModule from 'polymita/components/drawer'
import * as InputModule from 'polymita/components/input'
import * as ButtonModule from 'polymita/components/button'
import * as RSSPanelsTableModule from './RSSParamsTable'

import {getParamsFromPath } from '@/utils/index'
import { genUniquePlatformKey } from '@/shared/utils';

import rssSourceDriver from '@/drivers/rss'

type rssSourceDriverReturn = ReturnType<typeof rssSourceDriver>

export const name = 'SourceList' as const
export let meta: {
  props: SourceListProps,
  layoutStruct: SourceListLayout
  patchCommands: []
}

export interface SubscribedChannel{
  id: number
  createdAt: Date
  modifiedAt: Date
  type: number
  channel: string | null
  rss?: {
    id: number
    createdAt: Date
    modifiedAt: Date
    name: string
    href: string
    scheduleCron: string | null  
  }[]
}

export interface SourceListProps extends rssSourceDriverReturn {
  width: number
}

export const propTypes = {
}

const RSSSourcePanel = createFunctionComponent(RSSSourcePanelModule)
const Drawer = createFunctionComponent(DrawerModule)
const Input = createFunctionComponent(InputModule)
const Button = createFunctionComponent(ButtonModule)
const RSSTable = createFunctionComponent(RSSPanelsTableModule)

export const logic = (props: SourceListProps) => {
  
  return {
  }
}
type LogicReturn = ReturnType<typeof logic>

export type SourceListLayout = {
  type: 'sourceListContainer',
  children: [
  ]
}

const COLUMN_WIDTH_COUNT = 4;
const COLUMN_PADDING = 20;

export const layout = (props: SourceListProps): VirtualLayoutJSON => {
  const logic = useLogic<LogicReturn>()

  const columnWidth = (props.width - COLUMN_PADDING * 2 - 20) / COLUMN_WIDTH_COUNT;

  const {
    menus,
  } = props;

  const currentSource = props.currentSource()
  const params = currentSource && getParamsFromPath(currentSource.route.path, currentSource.route.paramsdesc)

  const selectedGroups = menus.selectedGroups();
  const selectedSubGroups = menus.selectedSubGroups();
  const allMenus = menus.allMenus()

  const rssSources = props.allRSSSources()
  const subscribed = props.subscribed()

  console.log('menus.groupRows()::', menus.groupRows());

  return (
    <sourceListContainer className="block">
      <sourceListMenus className='block'>
        <sourceMenuGroup className='w-full flex mb-2 flex-wrap'>
          <sourceMenuGroupPre className='block w-[80px] text-right mr-2'>
            分类: 
          </sourceMenuGroupPre>
          <sourceMenuGroupItems className='flex-1'>
            {allMenus.map(menu => {
              const cls = classnames(
                'inline-block cursor-pointer mr-1 rounded-md border mb-1',
                {
                  'border-transparent': !selectedGroups.includes(menu.title),
                  'border-slate-500': selectedGroups.includes(menu.title),
                }
              );
              return (
                <sourceMenuGroupItem key={menu.title} className={cls} onClick={()=>{
                  menus.selectGroup(menu.title)
                }}>
                  <sourceMenuGroupItemTitle className="text-gray-500 p-2">
                    {menu.title}
                  </sourceMenuGroupItemTitle>
                </sourceMenuGroupItem>
              )
            })}
          </sourceMenuGroupItems>
        </sourceMenuGroup>
        <sourceMenuSubGroup className='block'>
          {menus.groupRows().map(row => {
            return (
              <sourceGroupRow key={row.title} className='flex mb-2'>
                <sourceMenuSubGroupPre className='block w-[80px] text-right mr-2' >
                  {row.title}:
                </sourceMenuSubGroupPre>
                <sourceMenuSubGroupItems className='flex-1'>
                  {row.children.map(subGroup => {
                    const isSelected = selectedSubGroups.some(([g, g2]) => g === row.title && g2 === subGroup);

                    const cls = classnames(
                      'inline-block cursor-pointer mr-1 rounded-md border mb-1',
                      {
                        'border-transparent hover:border-slate-300': !isSelected,
                        'border-slate-500': isSelected,
                      }
                    );
                    
                    return (
                      <sourceMenuSubGroupItem 
                        key={`${row.title}-${subGroup}`} 
                        className={cls}  
                        onClick={() => {
                          menus.selectSubGroup(row.title, subGroup);
                        }}
                      >
                        <sourceMenuSubGroupItemTitle className="text-gray-500 p-2">{subGroup}</sourceMenuSubGroupItemTitle>
                      </sourceMenuSubGroupItem>
                    )
                  })} 
                </sourceMenuSubGroupItems>
              </sourceGroupRow>
            );
          })}
        </sourceMenuSubGroup>        
      </sourceListMenus>
      <div style={{ 
        columnCount: COLUMN_WIDTH_COUNT,
        columnFill: 'balance',
        padding: `0 ${COLUMN_PADDING}px`,
      }}>
        {rssSources?.map(source => {
          const key = genUniquePlatformKey(source);
          const subscribedChannel = subscribed.find(sub => {
            return sub.channel === key
          })
          const count = subscribedChannel?.rss?.length || 0;
          return (
            <RSSSourcePanel 
              width={columnWidth} 
              key={key}
              value={source}
              onClick={() => {
                props.selectCurrentSource(source)
              }} />
          )
        })}
      </div>
      {currentSource && (
        <Drawer 
          closable 
          width={1000} 
          onClose={() => props.selectCurrentSource(null)} 
          title={`${currentSource.group}/${currentSource.subGroup}/${currentSource.title}`} 
          extra={[
            <Button key="preview" onClick={() => props.queryPreview()} >preview</Button>,
            <Button 
              key="submit" disabled={props.showSubmitConfirm().visible}
              onClick={() => props.submit()}
            >submit</Button>,
          ]}
        >
          <sourceParamsTop className="flex flex-col mg-2 h-full">
            <submitConfirmMessage
              if={props.showSubmitConfirm().visible}
              className="flex mb-2 p-2 border border-yellow-600 justify-between items-center text-yellow-600"
            >
              <span>
                {props.showSubmitConfirm().title}
              </span>
              <Button onClick={() => props.showSubmitConfirm()} type="primary" >Sure</Button>
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
                {[].concat(currentSource.tables).filter(Boolean).map((table, index) => {
                  return (
                    <div key={table} className="mt-3">
                      <RSSTable tables={table} />
                    </div>
                  )
                })}
                <sourceItemParamTips className="block mt-2 p-4 bg-slate-200">
                  {currentSource.tipsMarkDown.map(tip => {
                    const converter = new showdown.Converter();
                    const html = converter.makeHtml(tip);
                    return (
                      <div className="break-all mb-2" _html={html}></div>                    
                    )
                  })}
                </sourceItemParamTips>

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
                    <Input 
                      placeholder='full content path'
                      value={props.sourcePreviewForm as any}
                      value-path={['fullContentPath']}
                    />
                  </sourcePreviewForm>
                </sourceExtraParamBox>
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
