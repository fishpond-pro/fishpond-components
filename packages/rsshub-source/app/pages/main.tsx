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
    console.log('w: ', w);
    if (w) {
      setWidth(w)
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
    <div ref={listDIVRef}>
      {width >= 0 ? (
        <SourceList 
          menus={menus}
          width={width} 
          sources={rsshubSourcesMock as any} 
          onQuery={async (form) => {
            console.log('[onQuery] form: ', form);
            return toRSS_JSON(sourceMock2).item
          }}
          onSubmit={(form) => {
            console.log('[onSubmit] form: ', form);
          }}
        />
      ) : null}
    </div>
  )
}