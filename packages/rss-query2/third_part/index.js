
module.exports = (config, app) => {
  const Router = require('@koa/router')

  const router = new Router()
  
  router.get('/', ctx => {

    

    ctx.body = 'hello'
  })
  router.prefix('/rss-query2')

  app.use(router.routes())
  
}