import React from 'react'
import { useSignal } from '@polymita/connect/dist/react';
import Button from '@mui/material/Button';
import writeMessage from '@/drivers/writeMessage';

export default function Main () {

  const wmDriver = useSignal(writeMessage)

  console.log('wmDriver.messages', wmDriver.messages());

  const [source, setSource] = React.useState(JSON.stringify({
    id: '',
    platform: 'zhihu',
  }, null, 2));

  const [message, setMessage] = React.useState(JSON.stringify({
    id: '',
    title: '',
    time: '',
    description: '',
    type: 'article',
    source: {
      connect: {
        id: ''
      }
    }
  }, null, 2));

  const [content, setContent] = React.useState(JSON.stringify({
    id: '',
    title: '',
    description: '',
    content: '我是内容, 时间是' + new Date(),
    message: {
      connect: {
        id: '',
      }
    }
  }, null, 2))


  return (
    <div>
      <div>
        <textarea className="border p-2 w-full" rows={10} value={source} onChange={e => setSource(e.target.value)}>
        </textarea>
      </div>
      <Button variant="contained" onClick={() => {
        wmDriver.saveSource(JSON.parse(source))
      } }>Save Source</Button>

      <div>
        <textarea className="border p-2 w-full" rows={10} value={message} onChange={e => setMessage(e.target.value)}>
        </textarea>
      </div>
      <Button variant="contained" onClick={() => {
        wmDriver.saveMessage(JSON.parse(message))
      }}>Save Message</Button>

      <div>
        <textarea className="border p-2 w-full" rows={10} value={content} onChange={e => setContent(e.target.value)}>
        </textarea>
      </div>
      <Button variant="contained" onClick={() => {
        
      }}>Save Content</Button>
    </div>
  )
}