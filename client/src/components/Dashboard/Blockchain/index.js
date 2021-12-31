import React, { useEffect, useContext, useState } from 'react'
import io from 'socket.io-client'
import { toast } from 'react-toastify'
import ScrollToBottom from 'react-scroll-to-bottom'
import { css } from '@emotion/css'

// styles
import { Grid, Button } from '@mui/material'

// components
import Block from './Block'
import Notification from 'components/Notifications'

// context
import { PeerContext } from 'components/App'

// api
import { postStartMining, postStopMining } from 'api/chain'

const Blockchain = ({ port }) => {
  const { chains, setChains } = useContext(PeerContext)
  const chain = chains.find((chain) => chain.port === port)
  const [isMiningLocked, setIsMiningLocked] = useState(chain.isMining)

  console.log('Blockchain', port)

  const handleOnClick = async () => {
    setIsMiningLocked((prev) => !prev)

    if (isMiningLocked) {
      try {
        const response = await postStopMining(port)
        toast.success(response.message)
      } catch (e) {
        toast.error(e.message)
      }
    }

    setChains(chains.map((chain) => (chain.port === port ? { ...chain, isMining: true } : chain)))

    try {
      const response = await postStartMining(port)
      toast.success(response.message)
    } catch (e) {
      toast.error(e.message)
    }
  }

  useEffect(() => {
    const socket = io.connect(`http://localhost:${port}`)
    socket.on('send-chain', (data) => {
      setChains(chains.map((chain) => (chain.port === port ? { ...chain, chain: data } : chain)))
    })
  }, [port, chains, setChains])

  return (
    <>
      <Button
        variant="outlined"
        sx={{ mb: 3 }}
        color={!isMiningLocked ? 'primary' : 'secondary'}
        onClick={handleOnClick}
      >
        {!isMiningLocked ? 'mine' : 'stop'}
      </Button>

      <ScrollToBottom className={css({ width: '90%', height: 500 })}>
        {chain.chain.map((block, i) => (
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
