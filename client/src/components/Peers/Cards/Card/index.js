import React, { useState, useContext } from 'react'

// styles
import {
  Box,
  Card as MuiCard,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Button,
} from '@mui/material'

// components
import Checkboxes from './Checkboxes'

// context
import { PeerContext } from 'components/App'

const Card = ({ id, port }) => {
  const { peers, setPeers, connections } = useContext(PeerContext)
  const [value, setValue] = useState(port)

  const handleOnChange = (e) => {
    const newPort = parseInt(e.target.value)
    setValue(newPort)
    setPeers(
      peers.map((peer) => (peer.id === id ? Object.assign({}, peer, { port: newPort }) : peer))
    )
  }

  const handleConnectPeers = (e) => {
    console.log('Available connections:')
    connections.forEach(({ port: from, to }) =>
      to.forEach(
        ({ port: to, connected }) => connected && from !== to && console.log(`${from} -> ${to}`)
      )
    )
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
          <Button variant="contained" onClick={handleConnectPeers}>
            Connect
          </Button>
        </CardActions>
      </MuiCard>
    </Box>
  )
}

export default Card
