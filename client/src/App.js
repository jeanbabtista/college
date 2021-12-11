import React, { useState } from 'react'

// mui
import { Container, Typography, CssBaseline, TextField } from '@mui/material'

// components
import UploadFile from './UploadFile'

export default function App() {
  const [port, setPort] = useState('')
  const url = `http://localhost:${port}`

  return (
    <>
      <CssBaseline />

      <Container maxWidth="lg" sx={{ marginTop: '80px' }}>
        <TextField
          fullWidth
          label="Port"
          value={port}
          onChange={(e) => setPort(e.target.value)}
        />

        <strong>Connection URL: </strong>
        <Typography variant="p">{url}</Typography>

        <UploadFile url={url} />
      </Container>
    </>
  )
}
