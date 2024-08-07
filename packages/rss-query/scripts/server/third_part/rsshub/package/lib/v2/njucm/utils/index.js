const got = require('../../../utils/got');
const cheerio = require('cheerio');
const { parseDate } = require('../../../utils/parse-date');
const timezone = require('../../../utils/timezone');

async function getNoticeList(ctx, url, host, listSelector, titleSelector, contentSelector) {
    const response = await got(url);
    const $ = cheerio.load(response.data);

    const list = $(listSelector)
        .toArray()
        .map((item) => {
            item = $(item);
            return {
                title: item.find(titleSelector).attr('title'),
                link: host + item.find(titleSelector).attr('href'),
            };
        });

    const out = await Promise.all(
        list.map((item) =>
            ctx.cache.tryGet(item.link, async () => {
                const response = await got(item.link);
                if (response.redirectUrls.length) {
                    item.link = response.redirectUrls[0];
                    item.description = '该通知无法直接预览，请点击原文链接↑查看';
                } else {
                    const $ = cheerio.load(response.data);
                    item.title = $(contentSelector.title).text();
                    item.description = $(contentSelector.content)
                        .html()
                        .replace(/src="\//g, `src="${new URL('.', host).href}`)
                        .replace(/href="\//g, `href="${new URL('.', host).href}`)
                        .trim();
                    item.pubDate = timezone(parseDate($(contentSelector.date).text()), +8);
                }
                return item;
            })
        )
    );

    return out;
}

module.exports = {
    getNoticeList,
};
