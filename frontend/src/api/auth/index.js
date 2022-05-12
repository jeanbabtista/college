import axios from 'axios'

import { endpoints, getResponse } from '../config'

// post login
export const postLogin = async (username, password) => {
  try {
    if (!username || !password) return getResponse(true, 'Username or password is empty')

    const { method, url } = endpoints.user.login
    const data = { username, password }

    const response = await axios({ method, url, data, credentials: 'include' })
    return response.data
  } catch (e) {
    return getResponse(true, e.message)
  }
}
