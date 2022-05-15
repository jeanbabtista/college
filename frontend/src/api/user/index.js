import axios from 'axios'
import { endpoints } from '../config'

export const findOneById = async (id) => {
  try {
    const { method, url } = endpoints.user.getProfile(id)
    const response = await axios({ method, url })
    return { ...response.data }
  } catch (e) {
    return { error: true, message: e.message }
  }
}
