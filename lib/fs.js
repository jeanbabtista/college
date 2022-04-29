const fs = require('fs')

const mkdir = (directory) => {
  if (!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true })
}

module.exports = { mkdir }
