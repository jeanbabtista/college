import React, { useState, useContext } from 'react'

// styles
import { Box, Card, CardContent, Typography, TextField } from '@mui/material'

// components
import { PeerContext } from 'components/App'

const PeerInput = ({ index }) => {
  const { peers, setPeers } = useContext(PeerContext)
  const [value, setValue] = useState(peers[index].port)

  const handleOnChange = (e) => {
    const port = parseInt(e.target.value)
    setValue(port)

    setPeers(
      [...peers].map((peer) => (peer.index === index ? Object.assign({}, peer, { port }) : peer))
    )
  }

  return (
    <Box sx={{ width: 250 }}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6">{index + 1}. peer</Typography>
          <TextField
            type="number"
            label="PORT"
            variant="filled"
            value={value}
            onChange={handleOnChange}
          />
        </CardContent>
      </Card>
    </Box>
  )
}

export default PeerInput
