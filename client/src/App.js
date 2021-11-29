import React, { useState } from 'react'
import io from 'socket.io-client'

// mui
import { Container, Grid, Button, Box } from '@mui/material'

// components
import IconInput from './IconInput'
import Chat from './Chat'

// config
const url = 'http://localhost:5000'
const socket = io.connect(url)

export default function App() {
  const [name, setName] = useState('')
  const [showChat, setShowChat] = useState(false)

  const joinChat = () => {
    if (!name) return
    socket.emit('join', name)
    setShowChat(true)
  }

  const leaveChat = () => {
    socket.emit('leave', name)
    setShowChat(false)
    setName('')
  }

  return (
    <Container maxWidth="sm">
      {!showChat ? (
        <div>
          <h1>Prijavite se v klepet {name}</h1>
          <Box sx={{ margin: '50px' }} />

          <Grid container spacing={4}>
            <Grid item xs={6}>
              <IconInput label="Ime" onChange={(e) => setName(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && joinChat()} />
            </Grid>

            <Grid item xs={6}>
              <Button variant="contained" onClick={() => name && joinChat()}>
                Prijava
              </Button>
            </Grid>
          </Grid>
        </div>
      ) : (
        <>
          <Chat socket={socket} user={name} />

          <Button variant="contained" onClick={leaveChat}>
            Odjava
          </Button>
        </>
      )}
    </Container>
  )
}
