import mi from '@/models/indexes.json'
import { createGetContext } from "@polymita/next-connect";
import * as modelActions from "./actions";
import { Plugin } from '@polymita/signal-model'

function wrapTrace (obj: any): any {
  return obj;
  let newObj = {}
  Object.keys(obj).forEach(name => {
    newObj[name] = function () {
      console.trace(name)
      return obj[name].apply(this, arguments)
    }
  })
  return newObj
}

export function createPlugin () {
  const isServer = typeof window === 'undefined'

  const plugin = new Plugin()

  plugin.loadPlugin('Model', {
    ...wrapTrace(modelActions),
  })

  plugin.loadPlugin('cookie', {
    set: modelActions.cookieSet,
    get: modelActions.cookieGet,
    clear: modelActions.cookieClear,
  })

  plugin.loadPlugin('Context', {
    async postDiffToServer(entity, d) {
      modelActions.executeDiff('prisma', entity, d)
    },
    postComputeToServer: modelActions.postComputeToServer,
    postQueryToServer: modelActions.postQueryToServer, 
  })

  return plugin
}

export const getContext = createGetContext({
  modelIndexes: mi,
  createPlugin,
})
