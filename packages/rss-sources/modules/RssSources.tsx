import rssSourceDriver from '@/signals/rss'
import { genUniquePlatformKey, getParamsFromPath } from '@/shared/utils';

import { SubscribedChannel } from '@/shared/types';

import { 
  h,
  useLogic, ConvertToLayoutTreeDraft,
  VirtualLayoutJSON, classnames
} from '@polymita/renderer';

import { useEffect, useRef, useState } from 'react';

type rssSourceDriverReturn = ReturnType<typeof rssSourceDriver>

export const name = 'RssSource' as const
export let meta: {
  props: RssSourceProps,
  layoutStruct: RssSourceLayout
  patchCommands: []
}

export interface RssSourceProps extends rssSourceDriverReturn {
  width: number
  subscribed: SubscribedChannel[]
}

export const propTypes = {
}

export const logic = (props: RssSourceProps) => {  
  const listDIVRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(-1)

  function onResize () {
    const w = listDIVRef.current?.offsetWidth
    const w2 = listDIVRef.current?.clientWidth
    const bbox = listDIVRef.current?.getBoundingClientRect()
    const { paddingLeft, paddingRight } = getComputedStyle(listDIVRef.current as Element);
    if (w) {
      const p1 = parseInt(paddingLeft);
      const p2 = parseInt(paddingRight);
      setWidth(w - p1 - p2);
    }
  }

  useEffect(() => {
    onResize()
  }, [])

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        onResize()
      });
    });
    observer.observe(listDIVRef.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  return {
    width,
    listDIVRef,
  }
}
type LogicReturn = ReturnType<typeof logic>

export type RssSourceLayout = {
  type: 'RssSourceContainer',
  children: [
  ]
}

const COLUMN_WIDTH_COUNT = 4;
const COLUMN_PADDING = 20;

export const layout = (props: RssSourceProps): VirtualLayoutJSON => {
  const logic = useLogic<LogicReturn>()

  const columnWidth = logic.width > 0 ? (logic.width - COLUMN_PADDING * 2 - 20) / COLUMN_WIDTH_COUNT : 0;

  const {
    menus,
  } = props;

  const currentSource = props.currentSource
  const params = currentSource && getParamsFromPath(currentSource.route.path, currentSource.route.paramsdesc)

  const selectedGroups = menus.selectedGroups
  const selectedSubGroups = menus.selectedSubGroups
  const allMenus = menus.allMenus

  const rssSources = props.allRSSSources
  const subscribed = props.subscribed

  return (
    <rssSourceContainer className="block" ref={logic.listDIVRef}>
      <rssSourceMenus className='block'>
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
          {menus.groupRows?.map(row => {
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
      </rssSourceMenus>
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
            <rssSourcePanel 
              width={columnWidth} 
              key={key + source.title}
              value={source}
              count={count}
              onClick={() => {
                props.selectCurrentSource(source)
              }} />
          )
        })}
      </div>
    </rssSourceContainer>
  )
}

export const styleRules = (props: RssSourceProps, layout: ConvertToLayoutTreeDraft<RssSourceLayout>) => {
  return [
  ]
}

export const designPattern = (props: RssSourceProps, layout: ConvertToLayoutTreeDraft<RssSourceLayout>) => {
  const logic = useLogic<LogicReturn>()
  return {}
}
