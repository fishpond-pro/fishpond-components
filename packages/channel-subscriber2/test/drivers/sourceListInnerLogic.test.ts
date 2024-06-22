import * as sm from '@polymita/signal-model'
import * as clientSm from '@polymita/signal-model/dist/signal-model.client'
import { preset } from '@polymita/server/dist/preset'
import path from 'node:path'


const source = () => ({
  group: 'group',
  subGroup: 'subGroup',
  title: 'title',
  route: {
    author: 'author',
    example: 'example',
    path: 'path',
    radar: true,
    rssbud: true,
    paramsdesc: ['paramsdesc']
  },
  tipsMarkDown: ['tipsMarkDown']
})

describe('test driver/sourceListInnerLogic', () => {
  describe('client', () => {
    beforeAll(() => {
      console.log('process.env.TEST_SERVER_PORT: ', process.env.TEST_SERVER_PORT);
      preset.testClientRuntime({ 
        port: process.env.TEST_SERVER_PORT || 9100,
        disableChainLog: true,
      })
    })
    const mockMs = () => ([{ title: 't1' }, { title: 't2' }])
    const mockForm = () => ({ path: 'test path', payload: { test: 'test' } })

    it('preview and submit', async () => {
      
    })
  })
  describe('server', () => {
    beforeAll(async () => {
      await preset.testServerRuntime({
        schemaFile: path.join(__dirname, '../../models/schema.prisma')
      })
    })
    it('hello server', async () => {
    })
  })
})