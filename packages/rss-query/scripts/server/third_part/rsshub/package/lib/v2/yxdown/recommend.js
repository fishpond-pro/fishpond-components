const got = require('../../utils/got');
const cheerio = require('cheerio');
const timezone = require('../../utils/timezone');
const { parseDate } = require('../../utils/parse-date');
const { rootUrl, getCookie } = require('./utils');

module.exports = async (ctx) => {
    const currentUrl = `${rootUrl}/news/`;
    const cookie = await getCookie();
    const response = await got(currentUrl, {
        headers: {
            cookie,
        },
    });

    const $ = cheerio.load(response.data);

    const list = $('ul li a b')
        .map((_, item) => {
            item = $(item);

            return {
                title: item.text(),
                link: item.parent().attr('href'),
            };
        })
        .get();

    const items = await Promise.all(
        list.map((item) =>
            ctx.cache.tryGet(item.link, async () => {
                const detailResponse = await got(item.link, {
                    headers: {
                        cookie,
                    },
                });
                const content = cheerio.load(detailResponse.data);

                content('h1, .intro').remove();

                item.description = content('.news').html();
                item.pubDate = timezone(parseDate(content('meta[property="og:release_date"]').attr('content')), +8);

                return item;
            })
        )
    );

    ctx.state.data = {
        title: '精彩推荐 - 游讯网',
        link: currentUrl,
        item: items,
    };
};
