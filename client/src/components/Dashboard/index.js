import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

// styles
import { Grid, Typography, Button } from '@mui/material'

// components
import Blockchain from './Blockchain'

// context
import { PeerContext } from 'components/App'

const Dashboard = () => {
  const { peers } = useContext(PeerContext)
  const navigate = useNavigate()

  return (
    <>
      <Button variant="contained" onClick={() => navigate('/peers')}>
        Go back to peers
      </Button>

      <Grid container>
        {peers.map((peer, i) => (
          <Grid item key={i} mt={8} xs={4}>
            <Typography variant="h4" mb={3}>
              Peer #{peer.port} chain
            </Typography>
            <Blockchain port={peer.port} />
          </Grid>
        ))}
      </Grid>
    </>
  )
}

export default Dashboard
