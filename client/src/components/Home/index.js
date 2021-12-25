import React from 'react'
import { useNavigate } from 'react-router-dom'

// styles
import { Box, Button } from '@mui/material'

const Home = () => {
  const navigate = useNavigate()

  return (
    <Box>
      <h1>Home</h1>
      <Button variant="contained" onClick={() => navigate('/peers')}>
        Peers
      </Button>
    </Box>
  )
}

export default Home
