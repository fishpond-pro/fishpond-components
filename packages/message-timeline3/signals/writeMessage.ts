'use client'
import {
  prisma,
  writePrisma,
} from '@polymita/next-connect'
import indexes from '../models/indexes.json'
import messageDriver, { MessageContent } from './message';


export default function writeMessage () {
  const { messages } = messageDriver()

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

  return {
    messages,
    saveChannelRecord,
    saveMessage,
    saveMessageContent,
  }
}