import {
  compose,
  injectModel,
  inputComputeInServer,
  prisma,
  state,
  writePrisma,
} from '@polymita/signal-model'
import indexes from '@/models/indexes.json'
import messageDriver from './message';


/**
 * Model Source
 * 
 */
export type Source = {
  id: number
  platform: string
  createdAt: Date
  modifiedAt: Date
}

/**
 * Model Message
 * 
 */
export type Message = {
  id: number
  link: string
  title: string | null
  time: Date | null
  description: string | null
  type: string
  sourceId: number
  createdAt: Date
  modifiedAt: Date
}

/**
 * Model Content
 * 
 */
export type Content = {
  id: number
  title: string
  description: string
  content: string
  messageId: number
  createdAt: Date
  modifiedAt: Date
}


export default function writeMessage () {
  const { messages } = compose(messageDriver)

  // source
  const sourceModel = prisma<Source[]>(indexes.source);
  console.log('sourceModel: ', sourceModel._hook.refresh);
  const writeSource = writePrisma(sourceModel);
  const saveSource = inputComputeInServer(async (param: Source) => {
    console.log('param: ', param);
    if (param.id) {
      await writeSource.update(param.id, param)
    } else {
      await writeSource.create(param)
    }
  })

  // message
  const messageModel = prisma<Message[]>(indexes.message);
  const writeMessage = writePrisma(messageModel);
  const saveMessage = inputComputeInServer(async (param: Message) => {
    if (param.id) {
      await writeMessage.update(param.id, param)
    } else {
      await writeMessage.create(param)
    }
  });

  // content
  const contentModel = prisma<Content[]>(indexes.content);
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