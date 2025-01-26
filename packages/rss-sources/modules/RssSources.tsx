import rssSourceDriver from '@/signals/rss'
import { genUniquePlatformKey, getParamsFromPath, RSSSource } from '@/shared/utils';
import * as RSSSourcePanelModule from './RSSSourcePanel2'
import '@polymita/renderer/jsx-runtime'
import { List } from '@mui/material';
import { ListItemButton } from '@mui/material';
import rssSignal from '@/signals/rss'

import { 
  h,
  useLogic, ConvertToLayoutTreeDraft,
  VirtualLayoutJSON, classnames,
  createFunctionComponent
} from '@polymita/renderer';

import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useRequest } from 'ahooks';

type rssSourceDriverReturn = ReturnType<typeof rssSourceDriver>

const RSSSourcePanel = createFunctionComponent(RSSSourcePanelModule)

export const name = 'RssSources' as const
export const namespace = 'components' as const
export const base = undefined
export let meta: {
  props: RssSourcesProps,
  layoutStruct: RssSourcesLayout
  patchCommands: []
}

export interface RssSourcesProps {
}

export const propTypes = {
}

export const logic = (props: RssSourcesProps) => {  
  const listDIVRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(-1)
  
  // const { menus, onQueryRssSources } = useContext(queryContext)
  // console.log('menus: ', menus);

  const menus = useRequest(async () => {
    return fetch('/third_part/rss/menu').then(r => r.json())
  })

  const queryRssSources = useRequest((arg) => {
    return fetch('/third_part/rss/sources', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        groupRows: arg
      })
    }).then(r => r.json() as Promise<RSSSource[]>)
  },{
    manual: true,
    
  })

  const menusData = useMemo(() => {
    return menus.data || []
  }, [menus.data])

  const rssSource = rssSignal({
    subscribed: [],
    menus: menusData,
    onQueryRssSources: async (arg) => {
      return queryRssSources.runAsync(arg)
    },
    onSelect: v => {
      console.log('[onSelect] select result: ', v);
    },
  });

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
    ...rssSource,
  }
}
type LogicReturn = ReturnType<typeof logic> & rssSourceDriverReturn

export type RssSourcesLayout = {
  type: 'RssSourcesContainer',
  children: [
  ]
}

export const layout = (props: RssSourcesProps): VirtualLayoutJSON => {
  const logic = useLogic<LogicReturn>()

  const {
    menus,
  } = logic;

  const selectedGroups = menus.selectedGroups
  const selectedSubGroups = menus.selectedSubGroups
  const allMenus = menus.allMenus

  const rssSources = logic.allRSSSources
  const subscribed = []

  return (
    <rssSourceContainer className="flex h-full" ref={logic.listDIVRef}>
      <rssLeftGroup className="w-[150px] h-full overflow-auto">
        <List>
          {allMenus.map(menu => {
            const selected = selectedGroups.includes(menu.title)
            const cls = classnames(
              'block cursor-pointer mr-1 rounded-md border mb-1',
              {
                'border-transparent': !selectedGroups.includes(menu.title),
                'border-slate-500': selectedGroups.includes(menu.title),
              }
            );
            return (
              <sourceMenuGroupItem key={menu.title} >
                <ListItemButton
                  selected={selected}
                  onClick={()=>{
                    menus.selectGroup(menu.title)
                  }}
                >
                  <sourceMenuGroupItem className="block flex-1" >
                    <sourceMenuGroupItemTitle className="text-gray-500 p-2">
                      {menu.title}
                    </sourceMenuGroupItemTitle>
                  </sourceMenuGroupItem>
                </ListItemButton>
              </sourceMenuGroupItem>
            )
          })}
        </List>
      </rssLeftGroup>
      <rssDivider className="w-[1px] mx-2 h-full bg-slate-200" />
      <rssRightSources className="flex-1 h-full"> 
        <rssSourceMenus className='block'>
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
        <rssSourceList className='flex flex-wrap gap-1'>
          {rssSources?.map((source, i) => {
            const key = genUniquePlatformKey(source);
            const subscribedChannel = subscribed?.find(sub => {
              return sub.channel === key
            })
            const count = subscribedChannel?.rss?.length || 0;
            return (
              <div data-index={i} className="box-border p-1 float-left" style={{ width: 'calc(25% - 10px)' }}>
                <RSSSourcePanel 
                  width='100%' 
                  key={key + source.title}
                  value={source}
                  count={count}
                />
              </div>
            )
          })}
        </rssSourceList>
      </rssRightSources>
    </rssSourceContainer>
  )
}

export const styleRules = (props: RssSourcesProps, layout: ConvertToLayoutTreeDraft<RssSourcesLayout>) => {
  return [
  ]
}

export const designPattern = (props: RssSourcesProps, layout: ConvertToLayoutTreeDraft<RssSourcesLayout>) => {
  const logic = useLogic<LogicReturn>()
  return {}
}
