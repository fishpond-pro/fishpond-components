const got = require('../../utils/got');
const cheerio = require('cheerio');
const timezone = require('../../utils/timezone');
const { parseDate } = require('../../utils/parse-date');

module.exports = async (ctx) => {
    const rootUrl = 'https://apin.eastday.com';
    const currentUrl = `${rootUrl}/api/news/Portrait`;

    const response = await got({
        method: 'post',
        url: currentUrl,
        json: {
            currentPage: 1,
            pageSize: 30,
        },
    });

    const list = response.data.list.map((item) => ({
        link: item.url,
        title: item.title,
        pubDate: timezone(parseDate(item.time), +8),
    }));

    const items = await Promise.all(
        list.map((item) =>
            ctx.cache.tryGet(item.link, async () => {
                const detailResponse = await got({
                    method: 'get',
                    url: item.link,
                });

                const content = cheerio.load(detailResponse.data);

                item.description = content('.detail').html();

                return item;
            })
        )
    );

    ctx.state.data = {
        title: '原创 - 东方网',
        link: 'https://www.eastday.com/eastday/shouye/07index/yc/index.html',
        item: items,
    };
};
