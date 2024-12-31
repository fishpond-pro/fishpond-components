const { rss } = require("./desktop-server/router/rss");
const { setting } = require("./desktop-server/router/setting");

module.exports = (config, app) => {
  
  console.log('[rss-query2]-third_part: loaded')

  app.use(async (ctx, next) => {
    
    console.log('[rss-query2]-third_part:', ctx.request.url)
    await next();
  })
  app.use(rss.routes());
  app.use(setting.routes());  
}