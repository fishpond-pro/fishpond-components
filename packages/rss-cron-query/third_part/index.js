const Router = require("koa-router");
const cronService = require('./cron-service/index')

const fs = require('fs')

module.exports = (config, app) => {

  const cron = new Router({
    prefix: '/cron',
  });

  cron.post('/add-rss', async (ctx) => {
    const { name, href } = ctx.request.body;
    if (name && href) {
      await ctx.prisma[ctx.modelIndexes['@polymita/rss-sources-add'].rSS].create({
        data: {
          name,
          href
        }
      })
      ctx.body = 'create success'
    } else {
      throw new Error('/add-rss need "name" and "href"')
    }
  })

  cron.post('/query', async (ctx, next) => {
    try {

      await cronService.immediateQuery(
        {
          modelIndexes: ctx.modelIndexes,
          client: ctx.prisma,
          port: config.port
        }
      );
      ctx.body = 'success'
    } catch (e) {
      ctx.code = 500;
      ctx.body = e.message
    }
  })
  
  console.log('[rss-cron-query]-third_part: loaded')

  app.use(async (ctx, next) => {   
    console.log('[rss-cron-query]-third_part:', ctx.request.url)

    const miFile = config.pointFiles.currentFiles.modelFiles.schemaIndexes
    let mi = {}
    if (fs.existsSync(miFile)) {
      mi = JSON.parse(fs.readFileSync(miFile, 'utf-8'))
    }
    ctx.modelIndexes = mi

    await next();
  })
  app.use(cron.routes());
}