import React, { useContext } from 'react'

// style
import { Grid } from '@mui/material'

// components
import Card from './Card'

// context
import { PeerContext } from 'components/App'

const Cards = () => {
  const { peers } = useContext(PeerContext)

  return (
    <Grid container mt={5} spacing={4}>
      {peers.map((peer, i) => (
        <Grid item key={i}>
          <Card id={peer.id} port={peer.port} />
        </Grid>
      ))}
    </Grid>
  )
}

export default Cards
