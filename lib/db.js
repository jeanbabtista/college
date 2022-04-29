const mongoose = require('mongoose')
const { config } = require('dotenv')

config({ path: `${__dirname}/../config/.env` })
const { DB_HOST: host, DB_PORT: port, DB_NAME: name } = process.env

const db = {
  url: `mongodb://${host}:${port}/${name}`,
  connect: async () => await mongoose.connect(db.url)
}

module.exports = db
