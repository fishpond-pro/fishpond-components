const { rss } = require("./desktop-server/router/rss");
const { setting } = require("./desktop-server/router/setting");

module.exports = (config, app) => {
  const Router = require('@koa/router')

  const router = new Router()
  
  router.prefix('/rss-query2')

  app.use(rss.routes(), rss.allowedMethods());
  app.use(setting.routes(), setting.allowedMethods());  
}