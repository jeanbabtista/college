import React from 'react'

// styles
import { Typography } from '@mui/material'

// components
import Slider from './Slider'
import Cards from './Cards'

const Peers = () => {
  return (
    <>
      <Typography variant="h3">Peers</Typography>
      <Slider minPeers={2} maxPeers={10} />
      <Cards />
    </>
  )
}

export default Peers
