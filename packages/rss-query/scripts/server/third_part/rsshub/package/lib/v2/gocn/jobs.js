const got = require('../../utils/got');
const util = require('./util');

module.exports = async (ctx) => {
    const base_url = 'https://gocn.vip/topics';
    const api_url = 'https://gocn.vip/apiv3/topic/jobs?currentPage=1&grade=new';

    const response = await got({
        url: api_url,
        headers: {
            Referer: base_url,
        },
    });

    const list = response.data.data.list;

    ctx.state.data = {
        title: `GoCN社区-招聘`,
        link: base_url,
        description: `获取GoCN站点最新招聘`,
        item: await Promise.all(list.map((item) => ctx.cache.tryGet(`${base_url}/${item.guid}`, () => util.getFeedItem(item)))),
    };
};
