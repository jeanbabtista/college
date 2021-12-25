import React from 'react'

// styles
import { Typography } from '@mui/material'

// components
import PeersSlider from './PeersSlider'
import PeersInput from './PeersInput'

const Peers = () => {
  return (
    <>
      <Typography variant="h3">Peers</Typography>
      <PeersSlider />
      <PeersInput />
    </>
  )
}

export default Peers
