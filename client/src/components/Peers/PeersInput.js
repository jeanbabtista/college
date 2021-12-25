import React, { useContext } from 'react'

// style
import { Grid } from '@mui/material'

// components
import PeerInput from './PeerInput'

// context
import { PeerContext } from 'components/App'

const PeersInput = () => {
  const { peers } = useContext(PeerContext)

  return (
    <Grid container mt={5} spacing={4}>
      {peers.map((peer, i) => (
        <Grid item key={i}>
          <PeerInput index={peer.index} />
        </Grid>
      ))}
    </Grid>
  )
}

export default PeersInput
