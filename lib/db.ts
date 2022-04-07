import { connect } from 'mongoose'
import { config } from 'dotenv'
import { global } from '../types/env'
import IEnv = global.IEnv

config({ path: '../config/.env' })

const db = {
  connect: async () => {
    const {
      DB_URI: uri,
      DB_NAME: name,
      DB_USER: user,
      DB_PASS: pass
    } = process.env as any as IEnv

    console.log(uri, name, user, pass)

    /*const result = await connect(`${uri}/${name}`, {
      user,
      pass
    })

    console.log(
      `Successfully connected to the database [${result.connection.host}]`
    )*/
  }
}

export default db
