import React, { useEffect, useRef } from 'react'
import 'polymita/index.css'
import SourceList from '@/views/RSSSourceList'
import rsshubSourcesMock from '@/shared/rsshub-sources.json'
import sourceMock2 from '@/shared/rss-mock'
import { toRSS_JSON } from '@/shared/utils'
import menus from '@/models/rsshub-source-menu.json'

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

  return (
    <div ref={listDIVRef} className='p-4'>
      {width >= 0 ? (
        <SourceList 
          subscribed={[]}
          menus={menus}
          width={width} 
          sources={rsshubSourcesMock as any} 
          onQuery={async (form) => {
            console.log('[onQuery] form: ', form);
            return toRSS_JSON(sourceMock2).item
          }}
          onSubmit={(...args) => {
            console.log('[onSubmit] form: ', args);
          }}
          onSelect={v => {
            console.log('[onSelect] select result: ', v);
          }}
        />
      ) : null}
    </div>
  )
}