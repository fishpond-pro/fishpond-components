const { setting } = require("./setting");

module.exports = (config, app) => {
  
  console.log('[rss-query2]-third_part: loaded')

  app.use(async (ctx, next) => {
    
    console.log('[rss-query2]-third_part:', ctx.request.url)
    await next();
  })
  app.use(setting.routes());
}