import React, { useEffect, useRef } from 'react'
import 'polymita/index.css'
import SourceList from '@/views/RSSSourceList'
import sourceMock from './source.json'
import sourceMock2 from '@/shared/source-mock'
import { toRSS_JSON } from '@/shared/utils'

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
          width={width} 
          sources={sourceMock} 
          onQuery={(form) => {
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