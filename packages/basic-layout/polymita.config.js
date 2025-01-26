/**
 * @type {import('@polymita/next-server/dist/lib').UserCustomConfig}
 */
module.exports = {
  ts: true,
 
  routes: {
    layout: {
      'main': ['App', { title: 'Polymita' }]
    }
  },

  settings: {
    title: 'Polymita',
  }
}
