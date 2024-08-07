const got = require('../../utils/got');
const cheerio = require('cheerio');
const timezone = require('../../utils/timezone');
const { parseDate } = require('../../utils/parse-date');

module.exports = async (ctx) => {
    const id = ctx.params.id ?? '3';

    const rootUrl = 'https://www.nbd.com.cn';
    const currentUrl = `${rootUrl}/columns/${id}/`;

    const response = await got({
        method: 'get',
        url: currentUrl,
    });

    const $ = cheerio.load(response.data);

    const list = $('.u-news-title a')
        .toArray()
        .map((item) => {
            item = $(item);

            return {
                title: item.text(),
                link: item.attr('href'),
            };
        });

    const items = await Promise.all(
        list.map((item) =>
            ctx.cache.tryGet(item.link, async () => {
                const detailResponse = await got({
                    method: 'get',
                    url: item.link,
                });
                const content = cheerio.load(detailResponse.data);

                item.description = content('.g-articl-text').html();
                item.pubDate = timezone(parseDate(detailResponse.data.match(/"pubDate": "(.*)"/)[1]), +8);

                return item;
            })
        )
    );

    ctx.state.data = {
        title: `${$('h1').text()} - 每经网`,
        link: currentUrl,
        item: items,
    };
};
