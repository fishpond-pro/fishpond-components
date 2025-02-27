const Router = require("koa-router");
const path = require('path')

const router = new Router({
  prefix: '/setting',
});


router.get('/get', async (ctx, next) => {
  try {
    const { key } = ctx.request.query;
    ctx.body = '/get from here'
  } catch (e) {
    ctx.statusCode = 500;
    ctx.body = e.message
  }
})

exports.setting = router;
