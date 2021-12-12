import React, { useState } from 'react'

// mui
import {
  Container,
  Grid,
  Typography,
  CssBaseline,
  TextField,
  Box,
} from '@mui/material'

// components
import UploadFile from './UploadFile'

export default function App() {
  const [portFrom, setPortFrom] = useState('9000')
  const [portTo, setPortTo] = useState('9001')
  const urlFrom = `http://localhost:${portFrom}`
  const urlTo = `http://localhost:${portTo}`

  return (
    <>
      <CssBaseline />

      <Container maxWidth="lg" sx={{ marginTop: '80px' }}>
        <Grid container justifyContent="space-around">
          <Grid item>
            <TextField
              fullWidth
              label="Port From"
              value={portFrom}
              onChange={(e) => setPortFrom(e.target.value)}
            />
          </Grid>
          <Grid item>
            <TextField
              fullWidth
              label="Port To"
              value={portTo}
              onChange={(e) => setPortTo(e.target.value)}
            />
          </Grid>
        </Grid>

        <Grid container justifyContent="space-around">
          <Grid item>
            <h2>Sending from:</h2>
            <Typography variant="p">{urlFrom}</Typography>
          </Grid>
          <Grid item>
            <h2>To:</h2>
            <Typography variant="p">{urlTo}</Typography>
          </Grid>
        </Grid>

        <Box sx={{ mt: 10, ml: 15 }}>
          <UploadFile urlFrom={urlFrom} urlTo={urlTo} />
        </Box>
      </Container>
    </>
  )
}
