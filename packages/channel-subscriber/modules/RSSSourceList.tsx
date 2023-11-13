import { classNames, h, SignalProps, PropTypes, useLogic, ConvertToLayoutTreeDraft, createFunctionComponent, VirtualLayoutJSON, classnames } from '@polymita/renderer';
import { ComputedSignal, Signal } from '@polymita/signal';
import * as RSSSourcePanelModule from './RSSSourcePanel'
import * as DrawerModule from 'polymita/components/drawer'
import * as InputModule from 'polymita/components/input'
import * as ButtonModule from 'polymita/components/button'
import * as RSSPanelsTableModule from './RSSParamsTable'

import {getParamsFromPath } from '@/utils/index'
import { genUniquePlatformKey } from '@/shared/utils';
import { SubscribedChannel } from '@/shared/types';

import rssSourceDriver from '@/drivers/rss'

type rssSourceDriverReturn = ReturnType<typeof rssSourceDriver>

export const name = 'SourceList' as const
export let meta: {
  props: SourceListProps,
  layoutStruct: SourceListLayout
  patchCommands: []
}

export interface SourceListProps extends rssSourceDriverReturn {
  width: number
  subscribed: ComputedSignal<SubscribedChannel[]>
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
