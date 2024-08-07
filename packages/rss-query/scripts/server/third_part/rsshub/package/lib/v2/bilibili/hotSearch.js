const got = require('../../utils/got');

module.exports = async (ctx) => {
    const url = `https://api.bilibili.com/x/web-interface/wbi/search/square?limit=10&platform=web&wts=${Math.floor(Date.now() / 1000)}`;
    const response = await got({
        method: 'get',
        url,
        headers: {
            Referer: `https://api.bilibili.com`,
        },
    });
    const trending = response?.data?.data?.trending;
    const title = trending?.title;
    const list = trending?.list || [];
    ctx.state.data = {
        title,
        link: url,
        description: 'bilibili热搜',
        item: list.map((item) => ({
            title: item.keyword,
            description: `${item.keyword}<br>${item.icon ? `<img src="${item.icon}">` : ''}`,
            link: item.link || item.goto || `https://search.bilibili.com/all?${new URLSearchParams({ keyword: item.keyword })}&from_source=webtop_search`,
        })),
    };
};
