const https = require('https')
const http = require('http')
const { HttpProxyAgent } = require('http-proxy-agent');
const { SocksProxyAgent } = require('socks-proxy-agent');
const { XMLParser, XMLBuilder, XMLValidator} = require("fast-xml-parser");
const { genRecord, frequency } = require('./frequency')

function createSocksProxyAgent (proxyHost, proxyPort) {
  // 创建Shadowsocks代理代理对象
  const proxyAgent = new SocksProxyAgent(`socks5://${proxyHost}:${proxyPort}`);

  return proxyAgent
}

async function querySource(options) {
  const mi = options.modelIndexes
  const client = options.client
  const dataSources = await client[mi['@polymita/rss-sources-add'].rSS].findMany({
    where: {
      id: {
        in: options.ids
      }
    },
    include: {
      directory: true,
    }
  });

  const r = await Promise.allSettled(
    dataSources.map(async (dataSource) => {
      console.log('[rss-cron-query.querySource] dataSource: ', dataSource);
      let fetchResult = fetchRSSSource(options, dataSource.directory, dataSource)
      if (fetchResult) {
        await fetchResult
      }
    })
  )  

  console.log(r)
}

async function fetchRSSSource (options, directory, rssSourceConfig) {
  const mi = options.modelIndexes
  const client = options.client

  if (rssSourceConfig) {
    const { href, record } = rssSourceConfig
    const uniqueChannel = `${directory ? `${directory}/` : ''}${rssSourceConfig.name}`
  
    const rssXML = await httpGet(buildRssHref(href, options));
    const parser = new XMLParser();
    const obj = parser.parse(rssXML);

    const { lastBuildDate, item } = obj.rss.channel
    console.log(`[rss-cron-query.fetchRSSSource][${uniqueChannel}] lastBuildDate: `, item.length, new Date(lastBuildDate));

    const timelineChannelRecord = await client[mi['@polymita/message-list'].channelRecord].findUnique({
      where: {
        channel: href,
      }
    })
    let newPartialItem = item; // item.slice(0,2);
    console.log(`[fetchRSSSource][${uniqueChannel}] timelineChannelRecord.id: `, timelineChannelRecord?.id);
    if (timelineChannelRecord) {
      const lastUpdatedDate = new Date(timelineChannelRecord.lastUpdatedDate)
      newPartialItem = newPartialItem.filter(obj => new Date(obj.pubDate) > lastUpdatedDate)
    }

    console.log(`[fetchRSSSource][${uniqueChannel}] newPartialItem.length: `, newPartialItem.length);

    writeMessageIntoSource(options, href, timelineChannelRecord, newPartialItem);
  }
}

async function writeMessageIntoSource (options, href, timelineChannelRecord, newPartialItem) {
  const mi = options.modelIndexes
  const client = options.client


  let timelineChannelRecordId = timelineChannelRecord?.id
  
  if (!timelineChannelRecordId) {
    console.log('[writeMessageIntoSource] record not exist', href)
    const createdTimelineChannelRecord = await client[mi['@polymita/message-list'].channelRecord].create({
      data: {
        channel: href,
        lastUpdatedDate: new Date(),
      },
    })
    timelineChannelRecordId = createdTimelineChannelRecord.id
  }

  const recordIds = [];

  for (const item of newPartialItem) {
    const obj = {
      link: item.link,
      title: item.title,
      description: item.description,
      type: 'article',
      time: new Date(item.pubDate), // 更新时间
    }

    const r = await client[mi['@polymita/message-list'].message].upsert({
      where: { link: obj.link },
      create: {
        ...obj,
        channelRecord: {
          connect: {
            id: timelineChannelRecordId
          }
        }
      },
      update: obj,
    })
    console.log(`[writeMessageIntoSource] upsert result:`, obj.title, r.id, r.time)
    recordIds.push(r.id);
  }

  console.log('recordIds: ', recordIds);
  frequency.insertHead(genRecord(recordIds))

  // update timestamp
  await client[mi['@polymita/message-list'].channelRecord].update({
    where: {
      id: timelineChannelRecordId,
    },
    data: {
      lastUpdatedDate: new Date(),    
    },
  })
}


function httpGet (url) {
  return new Promise((resolve, reject) => {
    const httpFn = /^https/.test(url) ? https: http
    const request = httpFn.get(
      url, 
      {
        // 不能本地代理本地，会导致死循环
        // agent: createSocksProxyAgent('127.0.0.1', 1086)
      }, 
      (res) => {  
        const { statusCode } = res
        console.log(`[querySource] httpGet "${url}" statusCode: `, statusCode);
        if (statusCode !== 200) {
          res.resume()
          reject(`Request Failed. Status Code: ${statusCode}`)
          return
        }
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
          try {
            resolve(rawData)
          } catch (e) {
            console.error(e.message);
            reject(e.message)
          }
        });
      }
    );
    request.on('error', (e) => {
      console.log(`[httpGet error] url=${url}`, e)
      reject(e);
    })
  })
}

function buildRssHref (href, options) {
  const isSlash = /^\//.test(href)

  return `http://127.0.0.1:${options.port}/third_part/rsshub${isSlash ? '' : '/'}${href}`
}

exports.querySource = querySource;

