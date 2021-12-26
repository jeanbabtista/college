import axios from 'axios'

export const getChain = async (port) => {
  const url = `http://localhost:${port}/chain`
  return (await axios.get(url)).data
}
