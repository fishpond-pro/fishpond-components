/**
 * @type {import('@polymita/next-server/dist/lib').UserCustomConfig}
 */
module.exports = {
  ts: true,
 
  routes: {
    pages: {
      '/': ['App', { title: 'Polymita' }]
    }
  },

  settings: {
    title: 'Polymita',
  }
}
