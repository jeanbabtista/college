const fs = require('fs')
const BASE_DIR = 'files'

const handleError = (message, e) => console.log(`${message}: ${e.message}`)

const parse = () => {
  if (process.argv.length !== 4) throw new Error('You have to provide server port and client port')

  return [parseInt(process.argv[2]), parseInt(process.argv[3])]
}

const mkdir = (dir) => {
  try {
    fs.mkdirSync(dir)
    console.log(`Created directory '${dir}'.`)
  } catch (e) {
    console.log(`Directory '${dir}' already exists.`)
  }
}

const getUrl = (port) => `http://localhost:${port}`
const getDir = (port) => `${BASE_DIR}-${port}`

module.exports = { parse, mkdir, getUrl, getDir, handleError }
