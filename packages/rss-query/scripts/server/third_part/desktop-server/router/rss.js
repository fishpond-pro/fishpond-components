const RSS_SOURCE_FULL = require('./rss/rsshub-source-full.json')
const Router = require("koa-router");
const fs = require('fs')
const path = require('path')
/**
 * @object {
 *  [group]: {
 *    [subGroup]: Source[]
 *  }
 * }
 */
const menuMap = {};

RSS_SOURCE_FULL.forEach(obj => {
  if (!menuMap[obj.group]) {
    menuMap[obj.group] = {};
  }
  if (!menuMap[obj.group][obj.subGroup]) {
    menuMap[obj.group][obj.subGroup] = [];
  }
  menuMap[obj.group][obj.subGroup].push(obj);
});

const menusTree = () => Object.keys(menuMap).map(firstMenu => {
  return {
    title: firstMenu,
    children: Object.keys(menuMap[firstMenu])
  }
});

fs.writeFileSync(path.join(__dirname, './rss/rsshub-source-menu.json'), JSON.stringify(menusTree(), null, 2))

const router = new Router({
  prefix: '/rss',
});

router.post("/sources", async (ctx, next) => {
  const { groupRows } = ctx.request.body;

  const result = [];

  groupRows?.forEach(([group, subGroup]) => {    
    let r = []
    if (group && subGroup) {
      r = menuMap[group][subGroup].filter(Boolean);
    }
    result.push(...r);
  })
  ctx.body = result;

  await next();
});

router.get('/search', async (ctx, next) => {
  const { keyword } = ctx.request.query;
  const reg = new RegExp(keyword, 'i');

  const arr = RSS_SOURCE_FULL.filter(obj => {
    return Object.values(obj).some(value => {
      if (typeof text === 'object') {
        return Object.values(obj).some(subValue => reg.test(subValue))
      }
      return reg.test(value)
    })
  });

  ctx.body = arr;
  await next();
})

router.get('/menu', async (ctx, next) => {
  ctx.body = menusTree();
  await next();
})
router.get('/name-map', async (ctx, next) => {
  ctx.body = menuMap;
  await next();
})

exports.rss = router
