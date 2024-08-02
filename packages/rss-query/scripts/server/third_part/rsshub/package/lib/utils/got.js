const logger = require('./logger');
const config = require('../config').value;
const got = require('got');
const { SocksProxyAgent } = require('socks-proxy-agent');

function createSocksProxyAgent (proxyHost, proxyPort) {
    // 创建Shadowsocks代理代理对象
    const proxyAgent = new SocksProxyAgent(`socks5://${proxyHost}:${proxyPort}`);
    return proxyAgent
}
  
const custom = got.extend({
    agent: {
        http: createSocksProxyAgent('127.0.0.1', 7890),
        https: createSocksProxyAgent('127.0.0.1', 7890),
    },
    retry: config.requestRetry,
    hooks: {
        beforeRetry: [
            (options, err, count) => {
                logger.error(`Request ${options.url} fail, retry attempt #${count}: ${err}`);
            },
        ],
        afterResponse: [
            (response) => {
                try {
                    response.data = JSON.parse(response.body);
                } catch (e) {
                    response.data = response.body;
                }
                response.status = response.statusCode;
                return response;
            },
        ],
        init: [
            (options) => {
                // compatible with axios api
                if (options && options.data) {
                    options.body = options.body || options.data;
                }
            },
        ],
    },
    headers: {
        'user-agent': config.ua,
    },
    timeout: config.requestTimeout,
});
custom.all = (list) => Promise.all(list);

module.exports = custom;
