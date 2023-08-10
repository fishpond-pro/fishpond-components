import * as sm from '@polymita/signal-model'
import * as clientSm from '@polymita/signal-model/dist/signal-model.client'
import { preset } from '@polymita/server/dist/preset'
import path from 'node:path'

import clientDriver from '../../.test/client/drivers/cjs/sourceListInnerLogic'
import serverDriver from '../../.test/server/drivers/cjs/sourceListInnerLogic'

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
    it('hello client', async () => {
      const runner = new clientSm.ModelRunner(clientDriver)
      const result = runner.init([
        {
          onQuery: () => Promise.resolve([{ title: 't1' }, { title: 't2' }]),
          onSubmit: () => {}
        }
      ])

      expect(Object.keys(result).length).toBeGreaterThan(0)

      result.selectCurrentSource(source())
      result.sourcePreviewForm(draft => {
        draft.path = 'test path'
        Object.assign(draft.payload, { test: 'test' })
      })
      await result.queryPreview()

      expect(result.previewMessages()).toEqual([{ title: 't1' }, { title: 't2' }])
    })    
  })
  describe('server', () => {
    beforeAll(async () => {
      await preset.testServerRuntime({
        schemaFile: path.join(__dirname, '../../models/schema.prisma')
      })
    })
    it('hello server', async () => {
      const runner = new sm.ModelRunner(serverDriver)
      const result = runner.init()

      expect(Object.keys(result).length).toBeGreaterThan(0)

      await runner.ready()
    })
  })
})