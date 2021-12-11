import React, { useState, useEffect } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'

// mui
import { css } from '@emotion/css'
import { Grid, TextField, Button, Box, Typography } from '@mui/material'
import SendIcon from '@mui/icons-material/SendOutlined'
import LogoutIcon from '@mui/icons-material/Logout'
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined'

// config
const scrollCss = css({ height: 400, marginTop: '40px' })

export default function Chat({ socket, user, encrypt, decrypt, leaveChat }) {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  const sendMessage = async () => {
    const data = { user, message: encrypt(message) }

    try {
      await socket.emit('send', data)
      setMessages((messages) => [...messages, data])
      setMessage('')
    } catch (e) {
      console.log(e.message)
    }
  }

  useEffect(() => {
    socket.on('receive', (message) => setMessages((prev) => [...prev, message]))
  }, [socket])

  useEffect(() => console.log(messages), [messages])

  return (
    <>
      <Typography variant="h2" sx={{ marginBottom: '50px' }}>
        Klepet
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={8}>
          <TextField
            value={message}
            label="Vnesite sporočilo"
            fullWidth
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && message && sendMessage()}
          />
        </Grid>
        <Grid item>
          <Button sx={{ height: '100%' }} variant="contained" onClick={() => message && sendMessage()}>
            <SendIcon />
          </Button>
        </Grid>
        <Grid item>
          <Button sx={{ height: '100%' }} variant="contained" onClick={leaveChat}>
            <LogoutIcon />
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ fontStyle: 'oblique', marginBottom: '50px' }}>
        <Typography variant="p">* S sporočilom GAMESTART in GAMESTOP lahko igrate igro ugibanja besed.</Typography>
      </Box>

      <ScrollToBottom className={scrollCss}>
        {messages.map(({ user, message }, i) => (
          <Typography key={i}>
            <ChevronRightOutlinedIcon />
            <strong>{user}</strong>: {decrypt(message)}
          </Typography>
        ))}
      </ScrollToBottom>
    </>
  )
}
