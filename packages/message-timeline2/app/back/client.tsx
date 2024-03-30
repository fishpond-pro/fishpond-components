'use client'
import React from 'react'
import Button from '@mui/material/Button';
import writeMessage from '../polymita/signals/writeMessage';
import { IHookContext } from '@polymita/signal';
import { useSignal } from '../polymita/hooks';

export default function Main (props: { ctx: IHookContext }) {

  const wmDriver = useSignal(props.ctx, writeMessage)

  console.log('wmDriver.messages', wmDriver.messages());

  const [source, setSource] = React.useState(JSON.stringify({
    channel: 'zhihu',
    lastUpdatedDate: new Date(),
  }, null, 2));

  const [message, setMessage] = React.useState(JSON.stringify({
    title: '低代码平台如何在不改表的情况下为实体增加扩展字段',
    time: new Date(),
    description: '基于Nop平台中内置的NopOrm引擎',
    type: 'article',
    link: 'https://zhuanlan.zhihu.com/p/618851796',
    channelRecord: {
      connect: {
        id: 1
      }
    }
  }, null, 2));

  const [content, setContent] = React.useState(JSON.stringify({
    title: '低代码平台如何在不改表的情况下为实体增加扩展字段',
    description: '新的描述',
    content: `具体做法非常简单，只需要在Excel数据模型中为数据表增加use-ext-field标签，即可启用全局扩展字段支持。扩展字段将保存到nop_sys_ext_field表中。nop_sys_ext_field表的结构如下：

    列名	类型
    entity_name	VARCHAR
    entity_id	VARCHAR
    field_name	VARCHAR
    field_type	INTEGER
    decimal_value	DECIMAL
    date_value	DATE
    timestamp_value	TIMESTAMP
    string_value	VARCHAR
    根据field_type字段类型的设置，具体的字段值保存到decimal_value等不同的字段中。`,
    message: {
      connect: {
        id: 1,
      }
    }
  }, null, 2))


  return (
    <div>
      <div>
        <textarea className="border p-2 w-full" rows={10} value={source} onChange={e => setSource(e.target.value)}>
        </textarea>
      </div>
      <Button onClick={() => {
        wmDriver.saveChannelRecord(JSON.parse(source))
      } }>Save Source</Button>

      <hr className="m-2 w-[200px]" />

      <div>
        <textarea className="border p-2 w-full" rows={10} value={message} onChange={e => setMessage(e.target.value)}>
        </textarea>
      </div>
      <Button onClick={() => {
        wmDriver.saveMessage(JSON.parse(message))
      }}>Save Message</Button>

      <hr className="m-2" />

      <div>
        <textarea className="border p-2 w-full" rows={10} value={content} onChange={e => setContent(e.target.value)}>
        </textarea>
      </div>
      <Button onClick={() => {
        wmDriver.saveMessageContent(JSON.parse(content));
      }}>Save Content</Button>
    </div>
  )
}