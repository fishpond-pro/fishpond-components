import {
  compose,
  injectModel,
  inputComputeInServer,
  prisma,
  state,
  writePrisma,
} from '@polymita/signal-model'
import indexes from '../models/indexes.json'
import messageDriver, { MessageContent } from './message';


export default function writeMessage () {
  const { messages } = compose(messageDriver)

  // source
  const sourceModel = prisma<ChannelRecord[]>(indexes.channelRecord);

  const writeChannelRecord = writePrisma(sourceModel);
  const saveChannelRecord = inputComputeInServer(async (param: ChannelRecord) => {
    if (param.id) {
      await writeChannelRecord.update(param.id, param)
    } else {
      await writeChannelRecord.create(param)
    }
  })

  // message
  const messageModel = prisma<MessageItem[]>(indexes.message);
  const writeMessage = writePrisma(messageModel);
  const saveMessage = inputComputeInServer(async (param: MessageItem) => {
    if (param.id) {
      await writeMessage.update(param.id, param)
    } else {
      await writeMessage.create(param)
    }
  });

  // content
  const contentModel = prisma<MessageContent[]>(indexes.messageContent);
  const writeMessageContent = writePrisma(contentModel);
  const saveMessageContent = inputComputeInServer(async (param: MessageContent) => {
    if (param.id) {
      await writeMessageContent.update(param.id, param)
    } else {
      await writeMessageContent.create(param)
    }
  });

  return {
    messages,
    saveChannelRecord,
    saveMessage,
    saveMessageContent,
  }
}