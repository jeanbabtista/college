import axios from 'axios'
import { endpoints } from '../config'

export const getMessages = async () => {
  try {
    const { method, url } = endpoints.message.getAll
    const response = await axios({ method, url })
    return { ...response.data }
  } catch (e) {
    return { error: true, message: e.message }
  }
}

export const create = async (title, imagePath, user, tags) => {
  try {
    const { method, url } = endpoints.message.create

    const data = new FormData()
    data.append('title', title)
    data.append('imagePath', imagePath)
    data.append('user', user)
    for (const tag of tags) data.append('tags[]', tag)

    const response = await axios({
      method,
      url,
      data,
      withCredentials: true,
    })

    return { ...response.data }
  } catch (e) {
    return { error: true, message: e.message }
  }
}

export const findOneById = async (id) => {
  try {
    const { method, url } = endpoints.message.findOneById(id)
    const response = await axios({ method, url /* , params: { id }  */ })
    return { ...response.data }
  } catch (e) {
    return { error: true, message: e.message }
  }
}

export const vote = async (messageId, option) => {
  try {
    const { method, url } = endpoints.message.vote(messageId, option)
    const response = await axios({ method, url, withCredentials: true /* params: { id } */ })
    return { ...response.data }
  } catch (e) {
    return { error: true, message: e.message }
  }
}

export const markInappropriate = async (messageId) => {
  try {
    const { method, url } = endpoints.message.markInappropriate(messageId)
    const response = await axios({ method, url, withCredentials: true /* params: { id } */ })
    return { ...response.data }
  } catch (e) {
    return { error: true, message: e.message }
  }
}

export const getAllByTag = async (tag) => {
  try {
    const { method, url } = endpoints.message.getAllByTag(tag)
    const response = await axios({ method, url })
    return { ...response.data }
  } catch (e) {
    return { error: true, message: e.message }
  }
}

export const getAllByFilterDecay = async () => {
  try {
    const { method, url } = endpoints.message.filterDecay
    const response = await axios({ method, url })
    return { ...response.data }
  } catch (e) {
    return { error: true, message: e.message }
  }
}
