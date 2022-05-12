const response = (error, message, data = null) => ({ error, message, data })

class Render {
  static error = (_req, res, error) => res.json(response(true, error.message))

  static register = (_req, res) => res.json(response(null, 'Successfully registered user'))

  static login = (req, res) => res.json(response(null, 'Successfully logged in', req.user))

  static info = (req, res, message, data) => res.json(response(null, message, data))

  static user = (req, res, user) => res.json(response(null, 'Successfully fetched user', user))
}

module.exports = Render
