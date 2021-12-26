import axios from 'axios'

export const postAddNode = async (portFrom, portTo) => {
  const url = `http://localhost:${portFrom}/nodes/add`
  const response = await axios.post(url, { port: portTo })
  return response
}
