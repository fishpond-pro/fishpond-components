const fs = require('fs');
const path = require('path');
const recordFileJSON = './cron-records.json'

const genRecord = (ids = []) => ({
  lastRun: new Date().getTime(),
  messageIds: ids
})

if (!fs.existsSync(recordFileJSON)) {
  fs.writeFileSync(recordFileJSON, '{}');
}

const frequency = {
  latest () {
    const records = JSON.parse(fs.readFileSync(recordFileJSON, 'utf8') || '[]')
    return records[0] || {}
  },
  insertHead (record) {
    const records = JSON.parse(fs.readFileSync(recordFileJSON, 'utf8') || '[]')
    records.unshift(record)
    fs.writeFileSync(recordFileJSON, JSON.stringify(records, null, 2))
  },
  enable (gapTimestamp = 60 * 60 * 1000) {
    const latestRecord = this.latest()
    const now = new Date().getTime()
    return now - (latestRecord.lastRun || 0) > gapTimestamp
  }
}

exports.frequency = frequency
exports.genRecord = genRecord