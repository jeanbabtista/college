import React, { useState, useEffect } from 'react'

// mui
import { Grid, TextField, Button, Box } from '@mui/material'
import SendIcon from '@mui/icons-material/SendOutlined'

export default function Chat({ socket, user }) {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  const sendMessage = async () => {
    const msg = { user, message }

    try {
      await socket.emit('send', msg)
      setMessages((messages) => [...messages, msg])
      setMessage('')
    } catch (e) {
      console.log(e.message)
    }
  }

  useEffect(() => {
    socket.on('receive', (message) => setMessages((prev) => [...prev, message]))
  }, [socket])

  return (
    <>
      <h1>Pozdravljeni, {user}</h1>
      <Box sx={{ margin: '50px' }} />

      <Grid container>
        <Grid item xs={11}>
          <TextField
            value={message}
            label="Vnesite sporočilo ..."
            fullWidth
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
        </Grid>
        <Grid item xs={1}>
          <Button sx={{ height: '100%' }} variant="contained" onClick={() => message && sendMessage()}>
            <SendIcon />
          </Button>
        </Grid>
      </Grid>

      <Grid item xs={8}>
        {messages.map((data, i) => (
          <p key={i}>
            <strong>&gt; {data.user}</strong>: {data.message}
          </p>
        ))}
      </Grid>
    </>
  )
}
