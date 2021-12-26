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
import { postAddNode } from 'api/addNode'

const Card = ({ id, port }) => {
  const { peers, setPeers, connections } = useContext(PeerContext)
  const [value, setValue] = useState(port)
  const [loading, setLoading] = useState(false)

  const handleOnChange = (e) => {
    const newPort = parseInt(e.target.value)
    setValue(newPort)
    setPeers(
      peers.map((peer) => (peer.id === id ? Object.assign({}, peer, { port: newPort }) : peer))
    )
  }

  const handleConnectPeers = async (e) => {
    const connectionsToConnect = connections
      .find((connection) => connection.port === port)
      .to.filter((connection) => connection.port !== port && connection.connected)
      .map((connection) => connection.port)

    console.log(`Port ${port} connecting to [${connectionsToConnect.join(', ')}] ...`)

    connectionsToConnect.forEach(async (portTo) => {
      setLoading(true)

      try {
        const response = await postAddNode(port, portTo)
        toast.success(response)
      } catch (e) {
        toast.error(e.message)
      } finally {
        setLoading(false)
      }
    })
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
          <LoadingButton loading={loading} variant="contained" onClick={handleConnectPeers}>
            Connect
          </LoadingButton>
        </CardActions>
      </MuiCard>

      <Notification />
    </Box>
  )
}

export default Card
