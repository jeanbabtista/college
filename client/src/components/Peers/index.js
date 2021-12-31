import React from 'react'
import { useNavigate } from 'react-router-dom'

// styles
import { Typography, Box, Button } from '@mui/material'

// components
import Slider from './Slider'
import Cards from './Cards'

const Peers = () => {
  const navigate = useNavigate()

  return (
    <>
      <Typography variant="h3">Peers</Typography>
      <Slider minPeers={2} maxPeers={8} />
      <Cards />

      <Box mt={15} />
      <Typography variant="p">Finished setting up peers? Go to dashboard -</Typography>
      <Button sx={{ ml: 1 }} variant="contained" onClick={() => navigate('/dashboard')}>
        Dashboard
      </Button>
    </>
  )
}

export default Peers
