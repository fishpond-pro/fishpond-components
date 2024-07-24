const app = require('./app')

const PORT = process.env.SERVER_PORT || 12333

exports.init = () => {
  app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`)
  })
}

