const Router = require("koa-router");
const cronService = require('../../cron-service/index')

const router = new Router({
  prefix: '/cron',
});

router.post('/query', async (ctx, next) => {
  try {
    await cronService.immediateQuery();
    ctx.body = 'success'
  } catch (e) {
    ctx.code = 500;
    ctx.body = e.message
  }
})

exports.cron = router;
