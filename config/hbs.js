const path = require('path')
const { engine } = require('express-handlebars')
const {
  Types: { ObjectId }
} = require('mongoose')
const {
  allowInsecurePrototypeAccess
} = require('@handlebars/allow-prototype-access')

module.exports = engine({
  layoutsDir: path.join(__dirname, '../views/layouts'),
  partialsDir: path.join(__dirname, '../views/partials'),
  defaultLayout: 'index',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(require('handlebars')),
  helpers: {
    formatDate: (date) => {
      const d = new Date(date)

      return `${d.getDate()}/${
        d.getMonth() + 1
      }/${d.getFullYear()}, ${d.getHours()}:${d.getMinutes()}`
    },
    ifEquals(arg1, arg2, options) {
      let condition

      // console.log(arg1, arg2)

      if (typeof arg1 === 'string' && typeof arg2 === 'string')
        condition = arg1 === arg2
      else if (typeof arg1 === 'object' && arg1 instanceof ObjectId)
        condition = arg1.equals(ObjectId(arg2))
      else if (typeof arg2 === 'object' && arg2 instanceof ObjectId)
        condition = arg2.equals(ObjectId(arg1))
      else condition = false

      return condition ? options.fn(this) : options.inverse(this)
    }
  }
})
