
module.exports = config => {
  const koa = require('koa')
  const router = require('@koa/router')()
  
  const app = new koa()
  router.get('/', ctx => {
    ctx.body = 'hello'
  })
  app.use(router.routes())
  
  app.listen(12345, () => {
    console.log('on:', 12345)
  })
}