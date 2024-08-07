const got = require('../../utils/got');
const cheerio = require('cheerio');
const { parseDate } = require('../../utils/parse-date');

const baseUrl = 'https://today.line.me';

const parseList = (items) =>
    items.map((item) => ({
        title: item.title,
        link: item.url.url,
        pubDate: parseDate(item.publishTimeUnix),
        hash: item.url.hash,
        category: item.categoryName,
    }));

const parseItems = (list, tryGet) =>
    Promise.all(
        list.map((item) =>
            tryGet(item.link, async () => {
                const edition = item.link.match(/today\.line\.me\/(\w+?)\/v2\/.*$/)[1];
                const { data } = await got(`${baseUrl}/webapi/portal/page/setting/article?country=${edition}&hash=${item.hash}&group=NA`);

                const $ = cheerio.load(data.data.content, null, false);

                $('img').each((_, img) => {
                    delete img.attribs['data-hashid'];
                    img.attribs.src = img.attribs.src.replace(/\/w\d+$/, '');
                });

                item.description = $.html();
                item.author = data.data.author;
                item.category = [...new Set([item.category, ...data.data.exploreLinks.map((link) => link.name)])];

                return item;
            })
        )
    );

module.exports = {
    baseUrl,
    parseList,
    parseItems,
};
