import axios from 'axios'
import { endpoints } from '../config'

export const getAll = async () => {
  try {
    const { method, url } = endpoints.tag.getAll
    const response = await axios({ method, url })
    return { ...response.data }
  } catch (e) {
    return { error: true, message: e.message }
  }
}
