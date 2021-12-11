import React from 'react'

// mui
import { Grid, Button, Typography, TextField } from '@mui/material'
import LoginIcon from '@mui/icons-material/Login'

export default function Login({ name, setName, joinChat }) {
  return (
    <div>
      <Typography variant="h3" sx={{ marginBottom: '50px' }}>
        Prijavite se v klepet
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField label="Ime" fullWidth onChange={(e) => setName(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && joinChat()} />
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" fullWidth sx={{ height: '50px' }} onClick={() => name && joinChat()}>
            <LoginIcon />
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}
