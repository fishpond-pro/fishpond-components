import {
  prisma,
  state,
} from '@polymita/signal-model'
import type { Message } from '../models/customPrismaClient/client'
import indexes from '../models/indexes.json'


export default function message () {

  const messages = prisma<Message[]>(indexes.message, () => ({
    orderBy: {
      createdAt: 'desc'
    }
  }))

  return {
    messages,
  }
}
