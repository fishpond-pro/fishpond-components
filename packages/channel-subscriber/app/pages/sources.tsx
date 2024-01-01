import React, { useEffect, useRef } from 'react'
import 'polymita/index.css'
import SourceList from '@/views/RSSSourceList'
import rsshubSourcesMock from '@/models/rsshub-sources.json'
import sourceMock2 from '@/shared/rss-mock'
import { genUniquePlatformKey, toRSS_JSON } from '@/shared/utils'
import menus from '@/models/rsshub-source-menu.json'
import ChannelList from '@/views/ChannelList'
import AddSourceDrawer from '@/views/AddSourceDrawer'
import channelDriver from '@/drivers/channel'
import { useSignal } from '@polymita/connect'
import rssDriver from '@/drivers/rss'
import SourceEntry from '@/views/SourceEntry'

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

  const channel = useSignal(channelDriver)

  const rssSource = useSignal(rssDriver, {
    subscribed: channel.channelsWithForm,
    menus,
    onQueryRssSources: async (arg) => {
      return arg.map(([g, subGroup]) => {
        return rsshubSourcesMock.filter(item => 
          item.group === g && item.subGroup === subGroup
        )
      }).flat().map(item => ({
        ...item,
        tables: typeof item.tables === 'string' ? [item.tables] : item.tables
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


  const uniqueChannel = genUniquePlatformKey(rssSource.currentSource());
  useEffect(() => {
    channel.currentChannel(uniqueChannel);
  }, [uniqueChannel]);

  return (
    <div className='flex h-screen'>
      <div className='w-[200px] border-r border-slate-100 h-full'>
        <div className='p-2'>
          <SourceEntry />
        </div>
        <div className='p-2'>
          <ChannelList
            list={channel.computedChannels}
            title="Aside Title" 
            onSubmit={(arg) => {
              channel.addRssChannel(arg)
            }}
            onClick={(item, i) => {
              console.log('item: ', i, item);
            }}
            onClickPlus={() => {
              console.log('onClickPlus');
            }}
          />
        </div>
      </div>
      <div ref={listDIVRef} className='p-4 flex-1 min-w-0'>
        {width >= 0 ? (
          <SourceList 
            subscribed={channel.channelsWithForm}
            width={width} 
            {...rssSource}
          />
        ) : null}

        {rssSource.currentSource() && (
          <AddSourceDrawer
            subscribed={channel.channelsWithForm}
            {...rssSource}
          />
        )}
    </div>
    </div>
  )
}