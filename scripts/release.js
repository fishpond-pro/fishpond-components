const { join, resolve, parse, relative } = require('path')
const { spawn, exec } = require('child_process')
const chalk = require('chalk')
const { existsSync, mkdirSync, readFileSync, fstat, readdirSync, writeFileSync } = require('fs')

const SHOULD_RELEASE = !!process.env.RELEASE

console.log('SHOULD_RELEASE: ', SHOULD_RELEASE);

const packagesPath = join(__dirname, '../packages/')
const allPackages = readdirSync(packagesPath).map(pkg => {
  return join(packagesPath, pkg)
})

const PKG = 'package.json'

const [specificModule] = process.argv.slice(2)
console.log('specificModule: ', specificModule);

function build(cwd) {
  if (specificModule && !(new RegExp(`${specificModule}$`).test(cwd))) {
    console.log(`skip building ${cwd}`)
    return Promise.resolve()
  }

  console.log(`start building ${chalk.green(cwd)} \n`)

  return new Promise((resolve, reject) => {
    const instance = spawn('npm', ['run', 'build'], {
      cwd,
      env: {
        ...process.env,
        // FORCE_COLOR: 1,
      },
      stdio: [process.stdin, process.stdout, 'pipe']
    })
    let hasError = false
    instance.stderr.on('data', (data) => {
      console.log(chalk.red(`${data}`));
      hasError = data.length
      if (hasError) {
        reject();
      }
    })
    instance.on('exit', (...args) => {
      if (!hasError) {
        console.log(`\nend building`, args)
        resolve()
      }
    })
  })
}

function publish (package) {
  return new Promise(resolve => {
    console.log('npm publish');
    exec(`npm publish`, { cwd: package }, (err, stdout) => {
      if (err) {
        throw err
      }
      if (stdout) {
        console.log(stdout);
      }
      resolve()
    })
  })
}

function commit () {
  return new Promise(resolve => {
    const taratPkg = JSON.parse(readFileSync(join(taratModule, PKG)).toString())
    exec(`git commit -a -m "release: fish-components v${taratPkg.version} "`, (err, stdout) => {
      if (err) {
        throw err
      }
      if (stdout) {
        console.log(stdout);
      }
      resolve()
    })
  })
}

function upgradePatch(dirPath) {
  const pkgJSONPath = join(dirPath, 'package.json')
  const pkgJSON = require(pkgJSONPath)
  pkgJSON.version = pkgJSON.version.replace(/\d+$/, (w) => parseInt(w) + 1)
  writeFileSync(pkgJSONPath, JSON.stringify(pkgJSON, null, 2))
}

console.time('release')

Promise.all(allPackages.map(dir => {
  return build(dir)
})).then(() => {
  if (SHOULD_RELEASE) {
    Promise.all(allPackages.map(upgradePatch))
      .then(() => {
        return commit()
      }).then(() => {
        return Promise.all(allPackages.map(publish))
      }).then(() => {
        console.timeEnd('release tarat')
      });
  }
})
