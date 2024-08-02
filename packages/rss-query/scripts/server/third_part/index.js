
module.exports.onMounted = (config) => {
  if (!globalThis.loaded) {
    globalThis.loaded = true

    require('./cron-service').init()
    require('./desktop-server').init()
    require('./rsshub/package/lib/index').init()
  }  
}
