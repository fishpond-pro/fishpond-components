const Router = require("koa-router");
const path = require('path')
const utils = require('../utils');

const router = new Router({
  prefix: '/setting',
});

const settingOperator = new utils.JsonOperator(
  path.join(__dirname, './setting/setting.json')
)

router.get('/get', async (ctx, next) => {
  try {
    const { key } = ctx.request.query;
    ctx.body = settingOperator.get(key)
  } catch (e) {
    ctx.statusCode = 500;
    ctx.body = e.message
  }
})
router.post('/set', async (ctx, next) => {
  try {
    const body = ctx.request.body;
    console.log('body: ', body);
    settingOperator.set(body);
    ctx.body = settingOperator.get()
  } catch (e) {
    ctx.statusCode = 500;
    ctx.body = e.message
  }
})

exports.setting = router;
