const Router = require("koa-router");
const fs = require('fs')
const path = require('path')
const koaBody = require('koa-body');
const utils = require('../utils');
const prisma = require('../prisma');

const router = new Router({
  prefix: '/opml',
});

async function parseOPML (file) {
  const text = fs.readFileSync(file, 'utf-8')
  const xmlObj = await utils.parseOPML(text)

  const outline = xmlObj
  // console.log('outline: ', JSON.stringify(outline, null, 2));
}

router.get('/export', async (ctx) => {
  ctx.body = '/opml/export'
})
router.post('/import', koaBody({ multipart: true }), async (ctx) => {
  const { file } = ctx.request.files;
  console.log('file: ', file);
  const text = fs.readFileSync(file.filepath, 'utf-8')
  const xmlObj = await utils.parseOPML(text)

  const outline = xmlObj

  await prisma.saveOpml(outline);

  const channels = await prisma.getChannels();
  // console.log('outline: ', JSON.stringify(outline, null, 2));
  ctx.body = channels;
})

exports.opml = router;