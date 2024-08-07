const got = require('../../../utils/got');
const cheerio = require('cheerio');
const timezone = require('../../../utils/timezone');
const { parseDate } = require('../../../utils/parse-date');

module.exports = async (ctx) => {
    const id = ctx.params.id ?? '7400';
    const limit = ctx.query.limit ? parseInt(ctx.query.limit) : 10;

    const rootUrl = 'https://ci-en.dlsite.com';
    const currentUrl = `${rootUrl}/creator/${id}/article?mode=list`;

    const response = await got({
        method: 'get',
        url: currentUrl,
    });

    const $ = cheerio.load(response.data);

    let items = $('.articleTitle a')
        .slice(0, limit)
        .toArray()
        .map((item) => {
            item = $(item);

            return {
                title: item.text(),
                link: item.attr('href'),
            };
        });

    items = await Promise.all(
        items.map((item) =>
            ctx.cache.tryGet(item.link, async () => {
                const detailResponse = await got({
                    method: 'get',
                    url: item.link,
                });

                const content = cheerio.load(detailResponse.data);

                content('.article-title').remove();

                content('.file-player-image').each(function () {
                    content(this).replaceWith(`<img src="${content(this).attr('data-actual')}">`);
                });

                item.description = content('article').html();
                item.pubDate = timezone(parseDate(content('.e-date').first().text()), +9);
                item.category = content('.c-hashTagList-item')
                    .toArray()
                    .map((t) => content(t).text().split('#').pop().trim());

                return item;
            })
        )
    );

    ctx.state.data = {
        title: $('title').text(),
        link: currentUrl,
        item: items,
    };
};
