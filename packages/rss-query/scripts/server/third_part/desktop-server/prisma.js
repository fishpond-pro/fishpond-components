const PrismaClient = require('../../models/customPrismaClient/client')
const mi = require('../../models/indexes.json');


const withPrisma = async (callback) => {
  const client = new PrismaClient.PrismaClient();
  await client.$connect();
  
  const result = await callback(client);

  await client.$disconnect();

  return result;
}

async function saveOpml(outlines) {
  await withPrisma(async (client) => {
    const rows = outlines.map((outline) => {
      const channel = {
        type: 0,
        channel: outline.title,
      };
      let rssArr = []
      if (outline.children?.length > 0) {
        outline.children.forEach((child) => {
          rssArr.push({
            name: child.title,
            href: child.xmlUrl,
          })
        })
      } else {
        rssArr.push({
          name: outline.title,
          href: outline.xmlUrl,
        })
      }
      return {
        channel,
        rssArr,
      }
    });
    // await Promise.all(rows.map(async (row) => {
    for (const row of rows) {
      console.log('row.channel.channel: ', row.channel.channel);
      const r = await client[mi['@polymita/channel-subscriber'].subscribedChannel].upsert({
        where: {
          channel: row.channel.channel
        },
        create: {
          type: row.channel.type,
          channel: row.channel.channel,
        },
        update: {
          type: row.channel.type,
          channel: row.channel.channel,
        }
      });
      console.log('r: ', r);
      for (const rss of row.rssArr) {
        try {
          await client[mi['@polymita/channel-subscriber'].rSS].upsert({
            where: {
              href: rss.href
            },
            create: {
              name: rss.name,
              href: rss.href,
              // subscribedChannelId: r.id,
              subscribedChannel: {
                connect: {
                  id: r.id
                }
              }
            },
            update: {
              name: rss.name,
              href: rss.href,
              // subscribedChannelId: r.id,
              subscribedChannel: {
                connect: {
                  id: r.id
                }
              }
            }
          })
        } catch (e) {
          console.log('rss e: ', r, rss, e);
        }
      }
    }
  })
}

function getChannels() {
  return withPrisma(client => {
    return client[mi['@polymita/channel-subscriber'].subscribedChannel].findMany({
      include: {
        rss: true
      }
    })
  })
}

exports.saveOpml = saveOpml;
exports.getChannels = getChannels;