const fs = require('fs')
const path = require('path')

const index = require('./index')
const utils = require('./utils')
const prisma = require('./prisma')

const testFile = path.resolve(__dirname, './router/opml/feeds.opml')
const text = fs.readFileSync(testFile, 'utf-8')
// utils.parseOPML(text).then((xmlObj) => {
//   console.log('xmlObj: ', xmlObj);

//   return prisma.saveOpml(xmlObj);
// }).then(() => {
//   console.log('done');

//   prisma.getChannels().then((channels) => {
//     console.log('channels: ', channels);
//   })
// })

index.init();