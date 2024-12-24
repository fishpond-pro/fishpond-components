/**
 * @type {import('@polymita/next-server/dist/lib').UserCustomConfig}
 */
module.exports = {
  ts: true,
  
  routes: {
    '/sources': ['RssSources']
  },

  services: ['@polymita/rss-query2']
}