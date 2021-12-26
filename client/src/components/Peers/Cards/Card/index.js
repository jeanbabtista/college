import React, { useState, useContext } from 'react'
import { toast } from 'react-toastify'

// styles
import {
  Box,
  Card as MuiCard,
  CardContent,
  CardActions,
  Typography,
  TextField,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'

// components
import Checkboxes from './Checkboxes'
import Notification from 'components/Notifications'

// context
import { PeerContext } from 'components/App'

// api
import { postAddNode } from 'api/nodes'
import { getChain } from 'api/chain'

const Card = ({ id, port }) => {
  const { peers, setPeers, connections, chains, setChains } = useContext(PeerContext)
  const [value, setValue] = useState(port)
  const [loading, setLoading] = useState(false)

  const handleOnChange = (e) => {
    const newPort = parseInt(e.target.value)
    setValue(newPort)
    setPeers(
      peers.map((peer) => (peer.id === id ? Object.assign({}, peer, { port: newPort }) : peer))
    )
  }

  const handleConnectPeers = async () => {
    setLoading(true)

    const connectionPorts = connections
      .find((connection) => connection.port === port)
      .to.filter((connection) => connection.port !== port && connection.connected)
      .map((connection) => connection.port)

    // console.log(`Port ${port} connecting to [${connectionPorts.join(', ')}] ...`)

    // get initial blockchain for current peer port
    try {
      const found = chains.find((chain) => chain.port === port)
      const fetchedChain = await getChain(port)

      setChains(
        found
          ? chains.map((chain) => (chain.port === port ? { ...chain, chain: fetchedChain } : chain))
          : [...chains, { port, chain: fetchedChain }]
      )

      toast.success('Successfully fetched blockchain')
    } catch (e) {
      toast.error(e.message)
    }

    // add peer nodes to the server
    try {
      for (const portTo of connectionPorts) {
        const response = await postAddNode(port, portTo)
        toast.success(response.data.message)
      }
    } catch (e) {
      toast.error(e.message)
    }

    setLoading(false)
  }

  return (
    <Box sx={{ width: 250 }}>
      <MuiCard>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {id}. peer
          </Typography>
          <TextField
            type="number"
            label="PORT"
            variant="filled"
            value={value}
            onChange={handleOnChange}
          />

          <Checkboxes id={id} port={port} />
        </CardContent>

        <CardActions>
          <LoadingButton loading={loading} variant="outlined" onClick={handleConnectPeers}>
            Connect
          </LoadingButton>
        </CardActions>
      </MuiCard>

      <Notification />
    </Box>
  )
}

export default Card
