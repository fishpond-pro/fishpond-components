const { baseUrl, parsePage } = require('./utils');

module.exports = async (ctx) => {
    const browser = await require('../../utils/puppeteer')();

    const { $, items } = await parsePage('sub', browser, ctx);

    await browser.close();

    ctx.state.data = {
        title: $('head title').text(),
        description: $('meta[name=description]').attr('content'),
        link: `${baseUrl}/subchannel.action?idSubChannel=${ctx.params.channel}`,
        image: `${baseUrl}/assets_new/img/fbshare.jpg`,
        language: $('meta[property="og:locale"]').attr('content'),
        item: items,
    };
};
