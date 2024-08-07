const got = require('../../utils/got');
const cheerio = require('cheerio');
const { parseDate } = require('../../utils/parse-date');

module.exports = async (ctx) => {
    const rootUrl = 'https://photo.cctv.com';
    const currentUrl = `${rootUrl}/jx/`;
    const response = await got({
        method: 'get',
        url: currentUrl,
    });

    const $ = cheerio.load(response.data);

    const list = $('.textr a')
        .slice(0, ctx.query.limit ? parseInt(ctx.query.limit) : 10)
        .map((_, item) => {
            item = $(item);
            return {
                title: item.text(),
                link: item.attr('href'),
            };
        })
        .get();

    const items = await Promise.all(
        list.map((item) =>
            ctx.cache.tryGet(item.link, async () => {
                const detailResponse = await got({
                    method: 'get',
                    url: item.link,
                });
                const content = cheerio.load(detailResponse.data);
                const date = content('head')
                    .html()
                    .match(/publishDate ="(.*) ";/)[1];
                item.pubDate = date ? parseDate(date, 'YYYYMMDDHHmmss') : null;

                item.description = content('.tujitop').html();

                return item;
            })
        )
    );

    ctx.state.data = {
        title: '央视网图片《镜象》',
        link: currentUrl,
        item: items,
    };
};
