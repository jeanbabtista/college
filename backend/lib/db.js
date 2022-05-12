const mongoose = require('mongoose')

const db = {
  url: `mongodb://0.0.0.0:27017/react`,
  connect: async () => await mongoose.connect(db.url),
}

module.exports = db
