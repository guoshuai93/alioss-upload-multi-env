const url = require('url')
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const globby = require('globby')
const OSS = require('ali-oss')
const log = console.log
const args = process.argv

module.exports = () => {
  const source = args[args.findIndex(el => el === '--source') + 1]
  const target = args[args.findIndex(el => el === '--target') + 1]
  const mode = args[args.findIndex(el => el === '--mode') + 1]
  if (source === undefined || target === undefined || mode === undefined) {
    log(chalk.yellow('******source or mode or target might not exist.******'))
    process.exit(1)
  }

  const ossConfigPath = path.join(process.cwd(), '.alioss.config.json')

  if (!fs.existsSync(ossConfigPath)) {
    throw new Error(`${ossConfigPath} is not found`)
  }

  const ossConfig = JSON.parse(
    fs.readFileSync(ossConfigPath, {
      encoding: 'utf8'
    })
  )

  const targetEnvConfig = ossConfig[mode]
  const { USERNAME, PASSWORD, REGION, BUCKET } = targetEnvConfig

  const client = new OSS({
    region: REGION,
    bucket: BUCKET,
    accessKeyId: USERNAME,
    accessKeySecret: PASSWORD
  })

  const files = globby.sync('**', { cwd: source })

  log('☕️ start upload at', chalk.green(mode))

  for (const file of files) {
    try {
      const objectName = `${target}/${file}`
      const localFile = `${source}/${file}`
      client.put(objectName, localFile)
      log('✔️', localFile)
    } catch (e) {
      log(e)
      process.exit(1)
    }
  }
}
