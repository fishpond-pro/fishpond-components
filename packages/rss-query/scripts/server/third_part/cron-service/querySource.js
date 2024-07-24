const https = require('https')
const http = require('http')
const PrismaClient = require('../../models/customPrismaClient/client')
const { HttpProxyAgent } = require('http-proxy-agent');
const { SocksProxyAgent } = require('socks-proxy-agent');
const { XMLParser, XMLBuilder, XMLValidator} = require("fast-xml-parser");
const mi = require('../../models/indexes.json');

function createSocksProxyAgent (proxyHost, proxyPort) {
  // 创建Shadowsocks代理代理对象
  const proxyAgent = new SocksProxyAgent(`socks5://${proxyHost}:${proxyPort}`);

  return proxyAgent
}


async function querySource(client, options) {
  const dataSources = await client[mi['@polymita/channel-subscriber'].subscribedChannel].findMany({
    where: {
      id: {
        in: options.ids
      }
    },
    include: {
      rss: true,
      rpa: true,
    }
  });

  await Promise.allSettled(
    dataSources.map(async (dataSource) => {
      console.log('[querySource] dataSource: ', dataSource);
      let fetchResult = null
      switch (dataSource.type) {
        case 0:
          fetchResult = fetchRSSSource(client, dataSource.channel, dataSource.rss)
          break
        case 1:
          /** @TODO do custom rpa */
          break
      }
      if (fetchResult) {
        await fetchResult
      }
    })
  )  
}

async function fetchRSSSource (client, channel, rssSourceConfigArr) {
  if (rssSourceConfigArr) {
    for (const rssSourceConfig of rssSourceConfigArr) {
      
      const { href, record } = rssSourceConfig
      const uniqueChannel = channel
      const did = record.id
    
      const rssXML = await httpGet(href);
      const parser = new XMLParser();
      const obj = parser.parse(rssXML);
  
      const { lastBuildDate, item } = obj.rss.channel
      console.log(`[fetchRSSSource][${uniqueChannel}] lastBuildDate: `, channel, new Date(lastBuildDate));
      console.log(`[fetchRSSSource][${uniqueChannel}] item.length: `, item.length);
  
      const timelineChannelRecord = await client[mi['@polymita/message-timeline2'].channelRecord].findUnique({
        where: {
          dataSource: did,
        }
      })
      let newPartialItem = item; // item.slice(0,2);
      console.log(`[fetchRSSSource][${uniqueChannel}] timelineChannelRecord.id: `, timelineChannelRecord?.id);
      if (timelineChannelRecord) {
        const lastUpdatedDate = new Date(timelineChannelRecord.lastUpdatedDate)
        newPartialItem = newPartialItem.filter(obj => new Date(obj.pubDate) > lastUpdatedDate)
      }
  
      console.log(`[fetchRSSSource][${uniqueChannel}] newPartialItem.length: `, newPartialItem.length);
  
      writeMessageIntoSource(client, did, uniqueChannel, timelineChannelRecord, newPartialItem);
    }
  }
}

async function writeMessageIntoSource (client, did, uniqueChannel, timelineChannelRecord, newPartialItem) {
  let timelineChannelRecordId = timelineChannelRecord?.id
  
  if (!timelineChannelRecordId) {
    console.log('did, uniqueChannel, timelineChannelRecord, newPartialItem: ', did, uniqueChannel, timelineChannelRecord);
    const createdTimelineChannelRecord = await client[mi['@polymita/message-timeline2'].channelRecord].create({
      data: {
        channel: uniqueChannel,
        lastUpdatedDate: new Date(),
        polymita_channel_subscriber_RSS: {
          connect: {
            id: did,
          }
        }
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

    const r = await client[mi['@polymita/message-timeline2'].message].upsert({
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
    console.log(`[writeMessageIntoSource][${uniqueChannel}]upert result:`, obj.title, r.id, r.time)
    recordIds.push(r.id);
  }

  console.log('recordIds: ', recordIds);
  frequency.insertHead(genRecord(recordIds))

  // update timestamp
  await client[mi['@polymita/message-timeline2'].channelRecord].update({
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

exports.querySource = querySource;
