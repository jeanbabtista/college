import React from 'react'
import { useNavigate } from 'react-router-dom'

// styles
import { Box, Button, Typography } from '@mui/material'

const Home = () => {
  const navigate = useNavigate()

  return (
    <Box>
      <Typography variant="h3">Home</Typography>
      <Typography variant="p">Define peers, connect them and start mining.</Typography>
      <Box mt={5} />
      <Button variant="contained" onClick={() => navigate('/peers')}>
        Peers
      </Button>
    </Box>
  )
}

export default Home
