import React, { useState } from 'react'
import io from 'socket.io-client'
import CryptoJS from 'crypto-js'

// mui
import { Container, CssBaseline } from '@mui/material'

// components
import Login from './Login'
import Chat from './Chat'

// encryption
const encrypt = (message, key = 'ključ123') => CryptoJS.AES.encrypt(message, key).toString()
const decrypt = (message, key = 'ključ123') => CryptoJS.AES.decrypt(message, key).toString(CryptoJS.enc.Utf8)

// config
const url = 'http://localhost:5000'
const socket = io.connect(url)

export default function App() {
  const [name, setName] = useState('')
  const [showChat, setShowChat] = useState(false)

  const joinChat = () => {
    const message = encrypt(name)
    socket.emit('join', message)
    setShowChat(true)
  }

  const leaveChat = () => {
    socket.emit('leave')
    setShowChat(false)
    setName('')
  }

  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ marginTop: '80px' }}>
        {!showChat ? (
          <Login name={name} setName={setName} joinChat={joinChat} />
        ) : (
          <Chat socket={socket} user={name} encrypt={encrypt} decrypt={decrypt} leaveChat={leaveChat} />
        )}
      </Container>
    </>
  )
}
