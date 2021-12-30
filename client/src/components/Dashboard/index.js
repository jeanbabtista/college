import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

// styles
import { Grid, Typography, Button, Box } from '@mui/material'

// components
import Blockchain from './Blockchain'

// context
import { PeerContext } from 'components/App'

const Dashboard = () => {
  const { chains } = useContext(PeerContext)
  const navigate = useNavigate()

  if (!chains.length)
    return (
      <>
        <Typography variant="p">You haven't connected any peers yet.</Typography>

        <Box mt={5} />
        <Button variant="contained" onClick={() => navigate('/peers')}>
          Peers
        </Button>
      </>
    )

  return (
    <>
      <Button variant="contained" onClick={() => navigate('/peers')}>
        Go back to peers
      </Button>

      <Grid container>
        {chains.map((chain, i) => (
          <Grid item key={i} mt={8} xs={4}>
            <Typography variant="h4" mb={3}>
              Peer #{chain.port} chain
            </Typography>
            <Blockchain port={chain.port} />
          </Grid>
        ))}
      </Grid>
    </>
  )
}

export default Dashboard
