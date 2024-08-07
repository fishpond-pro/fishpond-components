const got = require('../../utils/got');
const cheerio = require('cheerio');

const rootUrl = 'https://www.elitebabes.com';

const fetch = async (cache, currentUrl) => {
    const response = await got({
        method: 'get',
        url: currentUrl,
    });

    const $ = cheerio.load(response.data);

    $('.clip-a, .displayblock').remove();

    const list = $('.gallery-a li')
        .slice(0, 50)
        .map((_, item) => {
            item = $(item).children('a').eq(0);
            const image = item.find('img').eq(0);

            return {
                link: item.attr('href'),
                title: item.attr('title') || image.attr('alt'),
                itunes_item_image: image.attr('src').replace('_200', '_400'),
                pubDate: (item.next()[0] ? new Date(item.next().text()) : new Date()).toUTCString(),
            };
        })
        .get();

    const items = await Promise.all(
        list.map((item) =>
            cache.tryGet(item.link, async () => {
                try {
                    const detailResponse = await got({
                        method: 'get',
                        url: item.link,
                    });
                    const content = cheerio.load(detailResponse.data);

                    content('input, .link-btn, .m-pagination').remove();
                    content('.mobile-hide, .wide-hide').remove();

                    if (item.link.indexOf(`${rootUrl}/model/`) === 0) {
                        item.author = content('.fn').text();
                        item.description = content('#content').html();
                        return item;
                    }

                    const authors = [];
                    const video = content('video');

                    item.description = '';

                    if (video.length > 0) {
                        const poster = detailResponse.data.match(/posterImage: "(.*)",/);
                        item.itunes_item_image = (poster ? poster[1] : video.attr('poster')) || item.itunes_item_image;

                        item.enclosure_type = 'video/mp4';
                        item.enclosure_url = video.children('source').attr('src');
                        item.description = `<video controls loop preload="auto"><source src=${item.enclosure_url} type="video/mp4"/></video><img src="${item.itunes_item_image}">`;
                    }

                    content('.link-btn h2 a').each(function () {
                        authors.push(content(this).text());
                    });

                    item.author = authors.join(', ');

                    content('.list-justified2 li a').each(function () {
                        item.description += `<img src="${content(this).attr('href')}">`;
                    });

                    return item;
                } catch (e) {
                    return Promise.resolve('');
                }
            })
        )
    );

    return items;
};

module.exports = {
    rootUrl,
    fetch,
};
