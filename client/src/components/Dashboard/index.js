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

      <Grid container flexDirection="column">
        {chains.map((chain, i) => (
          <Grid item key={i} mt={8}>
            <Typography variant="h6">Peer #{chain.port} chain</Typography>
            <Blockchain chain={chain.chain} />
          </Grid>
        ))}
      </Grid>
    </>
  )
}

export default Dashboard
