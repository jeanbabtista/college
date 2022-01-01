import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { toast } from 'react-toastify'
import ScrollToBottom from 'react-scroll-to-bottom'
import { css } from '@emotion/css'

// styles
import { Grid, Button } from '@mui/material'

// components
import Block from './Block'
import Notification from 'components/Notifications'

// api
import { postStartMining } from 'api/chain'

const Blockchain = ({ port }) => {
  const [chain, setChain] = useState([])

  console.log('Blockchain', port)

  const handleOnClick = async () => {
    try {
      const response = await postStartMining(port)
      toast.success(response.message)
    } catch (e) {
      toast.error(e.message)
    }
  }

  useEffect(() => {
    const socket = io.connect(`http://localhost:${port}`)
    socket.on('send-chain', async (receivedChain) => setChain(receivedChain))
  }, [port])

  return (
    <>
      <Button variant="outlined" sx={{ mb: 3 }} onClick={handleOnClick}>
        Mine
      </Button>

      <ScrollToBottom className={css({ width: '90%', height: 500 })}>
        {chain.map((block, i) => (
          <Grid item key={i}>
            <Block {...block} />
          </Grid>
        ))}
      </ScrollToBottom>

      <Notification />
    </>
  )
}

export default Blockchain
