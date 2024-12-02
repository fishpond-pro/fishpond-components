/**
 * @type {import('@polymita/next-server/dist/lib').UserCustomConfig}
 */
module.exports = {
  ts: true,
 
  routes: {
    pages: {
      'main': ['App', { title: 'Polymita' }]
    }
  },

  settings: {
    title: 'Polymita',
  }
}
