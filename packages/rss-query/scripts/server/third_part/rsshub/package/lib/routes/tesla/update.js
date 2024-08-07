const got = require('../../utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const response = await got({
        method: 'get',
        url: 'https://www.notateslaapp.com/zh-cn',
        headers: {
            Referer: 'https://www.notateslaapp.com/zh-cn',
        },
    });

    const data = response.data;

    const $ = cheerio.load(data);
    const list = $('article[id]');

    ctx.state.data = {
        title: '特斯拉系统更新',
        link: 'https://www.notateslaapp.com/zh-cn',
        description: '特斯拉系统更新 - 最新发布',
        item:
            list &&
            list
                .map((index, item) => {
                    item = $(item);
                    const targetDate = item
                        .find('.date')
                        .text()
                        .replace(/[\u4e00-\u9fa5]/g, '-')
                        .replace(/\s/g, '')
                        .match(/(\d{4}-\d{1,2}-\d{1,2})/);
                    return {
                        title: item.find('.container h1').text(),
                        description: item.find('.notes-container').text() + '<img src="' + item.find('img').attr('src') + '">',
                        pubDate: targetDate[0],
                        link: 'https://www.notateslaapp.com' + item.find('.notes-container > .button-container > a').attr('href'),
                    };
                })
                .get(),
    };
};
