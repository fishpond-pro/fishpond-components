const PrismaClient = require('../../models/customPrismaClient/client')
const { querySource } = require('./querySource')
const { genRecord, frequency } = require('./frequency')

const { syncFiles } = require('./file-system')
/**
 * @param {Object} options - 选项参数
 * @param {number[]} options.ids - DataSource ID 数组 (可选)
 */
const init = async (options = {}) => {
  if (!frequency.enable()) return;

  await immediateQuery(options);

}


const immediateQuery = async (options = {}) => {
  const client = new PrismaClient.PrismaClient();
  await client.$connect();
  
  await querySource(client, options);

  await client.$disconnect();
}

const syncToFileSystem = async (options = {}) => {
  const client = new PrismaClient.PrismaClient();
  await client.$connect();
  
  const dir = path.join(__dirname, '../../files')
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  await syncFiles(client, {
    dir
  });

  await client.$disconnect();
}

exports.init = init
exports.cronQuery = init
exports.immediateQuery = immediateQuery
exports.syncToFileSystem = syncToFileSystem