import React, { useEffect, useContext } from 'react'
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
import { postMine } from 'api/chain'

const Blockchain = ({ port }) => {
  const { chains, setChains } = useContext(PeerContext)
  const chain = chains.find((chain) => chain.port === port)
  const miningLocked = chain.isMining

  const handleOnClick = async () => {
    setChains(chains.map((chain) => (chain.port === port ? { ...chain, isMining: true } : chain)))

    try {
      const response = await postMine(port)
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
      <Button variant="outlined" disabled={miningLocked} sx={{ mb: 3 }} onClick={handleOnClick}>
        Mine
      </Button>

      <ScrollToBottom className={css({ width: '90%', height: 500 })}>
        {chain.chain.map((block, i) => (
          <Grid item key={i}>
            <Block data={block} />
          </Grid>
        ))}
      </ScrollToBottom>

      <Notification />
    </>
  )
}

export default Blockchain
