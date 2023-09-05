import {
  compose,
  injectModel,
  inputComputeInServer,
  prisma,
  state,
  writePrisma,
} from '@polymita/signal-model'
import indexes from '@/models/indexes.json'
import messageDriver, { Content, MessageItem, Source } from './message';


export default function writeMessage () {
  const { messages } = compose(messageDriver)

  // source
  const sourceModel = prisma<Source[]>(indexes.channelRecord);

  const writeSource = writePrisma(sourceModel);
  const saveSource = inputComputeInServer(async (param: Source) => {
    if (param.id) {
      await writeSource.update(param.id, param)
    } else {
      await writeSource.create(param)
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
  const contentModel = prisma<Content[]>(indexes.messageContent);
  const writeContent = writePrisma(contentModel);
  const saveContent = inputComputeInServer(async (param: Content) => {
    if (param.id) {
      await writeContent.update(param.id, param)
    } else {
      await writeContent.create(param)
    }
  });

  return {
    messages,
    saveSource,
    saveMessage,
    saveContent,
  }
}