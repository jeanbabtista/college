import axios from 'axios'

export const getChain = async (port) => (await axios.get(`http://localhost:${port}/chain`)).data

export const postStartMining = async (port) => (await axios.post(`http://localhost:${port}/mining/start`)).data

export const postSetChain = async (portFrom, portTo) => (await axios.post(`http://localhost:${portFrom}/chain/set`, { port: portTo })).data
