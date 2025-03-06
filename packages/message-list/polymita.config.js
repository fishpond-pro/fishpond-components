module.exports = {
  ts: true,
  routes: {
    pages: {
      '/messages': ['MessagesContainer', { mode: 'iframe', title: 'messages', hidden: true }],
    },
  },
  overrides: [
    'RssMenuItem'
  ],
}