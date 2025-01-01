const { querySource } = require('./querySource')
const { genRecord, frequency } = require('./frequency')

const { syncFiles } = require('./file-system')
/**
 * @param {Object} options - 选项参数
 * @param {number[]} options.ids - DataSource ID 数组 (可选)
 * @param {number[]} options.client - prisma/client
 * @param {number[]} options.port - current service port
 */
const init = async (options) => {
  if (!frequency.enable()) return;

  await immediateQuery(options);

}


/**
 * @param {Object} options - 选项参数
 * @param {number[]} options.ids - DataSource ID 数组 (可选)
 * @param {number[]} options.client - prisma/client
 * @param {number[]} options.port - current service port
 */
const immediateQuery = async (options) => {
  
  await querySource(options);

}

const syncToFileSystem = async (options) => {
  
  const dir = path.join(__dirname, '../../files')
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  await syncFiles(options.client, {
    dir
  });

}

exports.init = init
exports.cronQuery = init
exports.immediateQuery = immediateQuery
exports.syncToFileSystem = syncToFileSystem