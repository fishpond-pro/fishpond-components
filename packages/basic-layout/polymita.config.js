/**
 * @type {import('@polymita/next-server')}
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
