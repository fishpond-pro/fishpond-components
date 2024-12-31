const mount = require('koa-mount')
const rsshubAPP = require("./rsshub/package/lib/app");

module.exports = (config, app) => {  
  console.log('[rss-query2]-third_part: loaded')

  Object.assign(app.context, rsshubAPP.context)

  app.use(async (ctx, next) => {
    console.log(ctx.debug);
    await next()
  })
  app.use(mount('/rsshub', rsshubAPP))
}