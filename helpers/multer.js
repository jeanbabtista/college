const multer = require('multer')

const upload = (dir) =>
  multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => cb(null, dir),
      filename: (req, file, cb) => cb(null, file.originalname),
    }),
  })

module.exports = upload
