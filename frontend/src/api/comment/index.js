import axios from 'axios'
import { endpoints } from '../config'

export const create = async (messageId, userId, text) => {
  try {
    const { method, url } = endpoints.comment.create
    const response = await axios({
      method,
      url,
      data: { messageId, user: userId, text },
      withCredentials: true,
    })
    return { ...response.data }
  } catch (e) {
    return { error: true, message: e.message }
  }
}
