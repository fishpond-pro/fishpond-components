/**
 * @type {import('@polymita/next-server/dist/lib').UserCustomConfig}
 */
module.exports = {
  ts: true,
  
  routes: {
    pages: {
      '/sources': ['RssSources']
    }
  },

  services: ['@polymita/rss-query2']
}