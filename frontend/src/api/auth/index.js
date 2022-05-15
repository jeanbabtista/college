import axios from 'axios'

import { endpoints } from '../config'

// post login
export const postLogin = async (username, password) => {
  try {
    if (!username || !password) return { error: true, message: 'Username or password is empty' }

    const { method, url } = endpoints.user.login
    const data = { username, password }

    const response = await axios({ method, url, withCredentials: true, data })
    return { ...response.data }
  } catch (e) {
    return { error: true, message: e.message }
  }
}

// post register
export const postRegister = async (username, password, email) => {
  try {
    if (!username || !password || !email)
      return { error: true, message: 'Username, password or email is empty' }

    const { method, url } = endpoints.user.register
    const data = { username, password, email }

    const response = await axios({ method, url, data })
    return { ...response.data }
  } catch (e) {
    return { error: true, message: e.message }
  }
}

// get logout
export const getLogout = async () => {
  try {
    const { method, url } = endpoints.user.logout

    // axios will automatically set the cookie
    const response = await axios({ method, url, withCredentials: true })
    return { ...response.data }
  } catch (e) {
    return { error: true, message: e.message }
  }
}
