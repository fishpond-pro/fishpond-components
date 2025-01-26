const { join, resolve, parse, relative } = require('path')
const { spawn, exec } = require('child_process')
const chalk = require('chalk')
const { existsSync, mkdirSync, readFileSync, fstat, readdirSync, writeFileSync } = require('fs')

const SHOULD_RELEASE = !!process.env.RELEASE

console.log('SHOULD_RELEASE: ', SHOULD_RELEASE);

const packagesPath = join(__dirname, '../packages/')
const allPackages = readdirSync(packagesPath)
  .sort((a, b) => {
    if (a === 'rss-sources-add') {
      return 1
    }
    if (b === 'rss-sources-add') {
      return -1
    }
    return 0
  })
  .filter(m => m !== 'rss-query')
  .map(pkg => {
    return join(packagesPath, pkg)
  })

const PKG = 'package.json'

const [specificModule] = process.argv.slice(2)
console.log('specificModule: ', specificModule);

async function buildDeps () {
}

function build(cwd) {
  if (specificModule && !(new RegExp(`${specificModule}$`).test(cwd))) {
    console.log(`skip building ${cwd}`)
    return Promise.resolve()
  }

  console.log(`start building ${chalk.green(cwd)} \n`)

  return new Promise((resolve, reject) => {
    const instance = spawn('npm', ['run', 'build'], {
      cwd,
      // stdio: [process.stdin, process.stdout, 'pipe']
      stdio: 'inherit'
    })
    let hasError = false
    // instance.stderr.on('data', (d) => {
    //   console.error(`${chalk.red('error')}:${d}`)
    //   hasError = true
    // })

    instance.on('close', (code, signal) => {
      console.log('code, signal: ', code, signal);
      if (code || hasError) {
        console.log(chalk.red(`build ${cwd} failed`));
        reject()
      } else {
        console.log(chalk.green(`build ${cwd} success`));
        resolve()
      }
    })
  })
}

// Promise.all
let st = Date.now();

console.log('allPackages: ', allPackages);

(allPackages.reduce((p, dir) => {
  return p.then(() => build(dir))
}, Promise.resolve())).then(async () => {
  console.log('build end, cost ', (Date.now() - st) / 1000 / 60, 'min')
})