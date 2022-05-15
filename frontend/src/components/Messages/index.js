import { Grid, Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getMessages } from '../../api/message'

import MessageCard from './MessageCard'
import MessageForm from './MessageForm'

export default function Messages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const { error, message, data } = await getMessages()

      if (error) setError(message)
      else setMessages(data)

      setLoading(false)
    })()
  }, [])

  if (loading) return <div>Loading...</div>

  if (error) return <div>Error: {error}</div>

  return (
    <>
      <MessageForm setMessages={setMessages} />

      <Box
        sx={{
          marginTop: 8,
          marginLeft: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Grid container>
          {messages.map((message) => (
            <Grid mt={2} item xs={4} key={message.id}>
              <MessageCard {...message} />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Outlet />
    </>
  )
}
