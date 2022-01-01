import axios from 'axios'

export const postAddNode = async (portFrom, portTo) => (await axios.post(`http://localhost:${portFrom}/nodes/add`, { port: portTo })).data
