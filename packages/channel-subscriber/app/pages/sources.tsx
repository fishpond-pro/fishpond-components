import React, { useEffect, useRef } from 'react'
import 'polymita/index.css'
import SourceList from '@/views/RSSSourceList'
import rsshubSourcesMock from '@/shared/rsshub-sources.json'
import sourceMock2 from '@/shared/rss-mock'
import { toRSS_JSON } from '@/shared/utils'
import menus from '@/models/rsshub-source-menu.json'
import View from '@/views/AsideSourceList'
import SourceDriver from '@/drivers/source'
import { useSignal } from '@polymita/connect'
import rssSourceDriver from '@/drivers/rssSource'

export default function Main () {
  const listDIVRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = React.useState(-1)

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

  const source = useSignal(SourceDriver)

  const rssSource = useSignal(rssSourceDriver, {
    menus,
    onQueryRssSources: async (arg) => {
      return arg.map(([g, subGroup]) => {
        return rsshubSourcesMock.filter(item => 
          item.group === g && item.subGroup === subGroup
        )
      }).flat().map(item => ({
        ...item,
        tables: item.tables.split('\n')
      }))
    },
    onQueryPreviews: async (form) => {
      console.log('[onQuery] form: ', form);
      return toRSS_JSON(sourceMock2).item
    },
    onSubmit: (...args) => {
      console.log('[onSubmit] form: ', args);
    },
    onSelect: v => {
      console.log('[onSelect] select result: ', v);
    },
  });

  return (
    <div className='flex'>
      <div className='w-[200px] border-r border-black'>
        <View
          list={source.ds as any}
          title="Aside Title" 
          onSubmit={(arg) => {
            source.addSource(arg)
          }}
          onClick={(item, i) => {
            console.log('item: ', i, item);
          }}
          onClickPlus={() => {
            console.log('onClickPlus');
          }}
        />
      </div>
      <div ref={listDIVRef} className='p-4 flex-1 min-w-0'>
        {width >= 0 ? (
          <SourceList 
            width={width} 
            {...rssSource}
          />
        ) : null}
    </div>
    </div>
  )
}