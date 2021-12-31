import axios from 'axios'

export const getChain = async (port) => (await axios.get(`http://localhost:${port}/chain`)).data

export const postStartMining = async (port) =>
  (await axios.post(`http://localhost:${port}/start_mining`)).data

export const postStopMining = async (port) =>
  (await axios.post(`http://localhost:${port}/stop_mining`)).data
