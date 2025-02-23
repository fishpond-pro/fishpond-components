'use client'
import React, { useState } from 'react'
import { Button } from '@mui/material';
import indexes from '@/models/indexes.json'
import { MessageContent } from '@/models/indexesTypes';
import { writePrisma } from '@polymita/next-connect';

export default function Main (props: {}) {
  const [params, setParams] = useState<{ messageId: number,channelRecordId: number, size: number }>({
    messageId: undefined,
    channelRecordId: undefined,
    size: 50,
  })

  const writeChannelRecord = writePrisma(indexes.channelRecord);
  const saveChannelRecord = async (param: ChannelRecord) => {
    if (param.id) {
      await writeChannelRecord.update(param.id, param)
    } else {
      await writeChannelRecord.create(param)
    }
  }

  // message
  const writeMessage = writePrisma(indexes.message);
  const saveMessage = async (param: MessageItem) => {
    if (param.id) {
      await writeMessage.update(param.id, param)
    } else {
      await writeMessage.create(param)
    }
  };

  // content
  const writeMessageContent = writePrisma(indexes.messageContent);
  const saveMessageContent = async (param: MessageContent) => {
    if (param.id) {
      await writeMessageContent.update(param.id, param)
    } else {
      await writeMessageContent.create(param)
    }
  };

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
        saveChannelRecord(JSON.parse(source))
      } }>Save Source</Button>

      <hr className="m-2 w-[200px]" />

      <div>
        <textarea className="border p-2 w-full" rows={10} value={message} onChange={e => setMessage(e.target.value)}>
        </textarea>
      </div>
      <Button onClick={() => {
        saveMessage(JSON.parse(message))
      }}>Save Message</Button>

      <hr className="m-2" />

      <div>
        <textarea className="border p-2 w-full" rows={10} value={content} onChange={e => setContent(e.target.value)}>
        </textarea>
      </div>
      <Button onClick={() => {
        saveMessageContent(JSON.parse(content));
      }}>Save Content</Button>
    </div>
  )
}