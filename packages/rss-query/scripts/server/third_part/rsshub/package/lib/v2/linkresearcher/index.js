const got = require('../../utils/got');
const qs = require('query-string');
const { parseDate } = require('../../utils/parse-date');

const baseURL = 'https://www.linkresearcher.com';

module.exports = async (ctx) => {
    // parse params
    const { params } = ctx.params;
    const query = qs.parse(params);

    const categoryMap = { theses: '论文', information: '新闻', careers: '职业' };
    const category = query.category;
    let title = categoryMap[category];

    // get XSRF token from main page
    const metaURL = `${baseURL}/${category}`;
    const metaResponse = await got(metaURL);
    const xsrfToken = metaResponse.headers['set-cookie'][0].split(';')[0].split('=')[1];

    let data = { filters: { status: false } };
    if (typeof query.subject !== 'undefined' && typeof query.columns !== 'undefined') {
        data = { filters: { status: true, subject: query.subject, columns: query.columns } };
        title = `${title}「${query.subject} & ${query.columns}」`;
    } else if (typeof query.subject !== 'undefined' && typeof query.columns === 'undefined') {
        data = { filters: { status: true, subject: query.subject } };
        title = `${title}「${query.subject}」`;
    } else if (typeof query.subject === 'undefined' && typeof query.columns !== 'undefined') {
        data = { filters: { status: true, columns: query.columns } };
        title = `${title}「${query.columns}」`;
    }
    data.query = query.query;
    const dataURL = `${baseURL}/api/${category === 'careers' ? 'articles' : category}/search`;
    const pageResponse = await got.post(dataURL, {
        headers: {
            'content-type': 'application/json; charset=UTF-8',
            'x-xsrf-token': xsrfToken,
            cookie: `XSRF-TOKEN=${xsrfToken}`,
        },
        searchParams: {
            from: 0,
            size: 20,
            type: category === 'careers' ? 'CAREER' : 'SEARCH',
        },
        json: data,
    });

    const list = pageResponse.data.hits;

    const out = list.map((item) => ({
        title: item.title,
        description: item.content,
        pubDate: parseDate(item.createdAt, 'x'),
        link: `${metaURL}/${item.id}`,
        guid: `${metaURL}/${item.id}`,
        doi: typeof item.identCode !== 'undefined' ? item.identCode : '',
        author: typeof item.authors !== 'undefined' ? item.authors.join(', ') : '',
    }));

    ctx.state.data = {
        title: `领研 | ${title}`,
        description:
            '领研是链接华人学者的人才及成果平台。领研为国内外高校、科研机构及科技企业提供科研人才招聘服务，也是青年研究者的职业发展指导及线上培训平台；研究者还可将自己的研究论文上传至领研，与超过五十万华人学者分享工作的最新进展。',
        image: 'https://www.linkresearcher.com/assets/images/logo-app.png',
        link: baseURL,
        item: out,
    };
};
