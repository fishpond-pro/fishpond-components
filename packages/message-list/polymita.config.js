module.exports = {
  ts: true,
  routes: {
    pages: {
      '/messages': ['MessagesContainer', { mode: 'iframe', title: 'messages' }],
    },
  },
  overrides: [
    'RssMenuItem'
  ],
}