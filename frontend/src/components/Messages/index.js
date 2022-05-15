import { Grid, Box, Typography, TextField } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'

import { getMessages, getAllByTag, getAllByFilterDecay } from '../../api/message'

import MessageCard from './MessageCard'
import MessageForm from './MessageForm'

export default function Messages() {
  const [messages, setMessages] = useState([])
  const [filterTag, setFilterTag] = useState('')

  useEffect(() => {
    ;(async () => {
      let response

      if (filterTag === 'decay') response = await getAllByFilterDecay()
      else if (filterTag) response = await getAllByTag(filterTag)
      else response = await getMessages()

      const { error, data } = response
      setMessages(error ? (await getMessages()).data : data)
    })()
  }, [filterTag])

  return (
    <>
      <MessageForm setMessages={setMessages} />

      <hr />

      <TextField
        label="Filter by tags"
        variant="outlined"
        fullWidth
        mt={5}
        onChange={(e) => setFilterTag(e.target.value)}
      />

      <Typography variant="body1" color="gray" sx={{ fontStyle: 'italic' }}>
        Type *decay* to see decayed sorting
      </Typography>

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
          {!messages.length ? (
            <Typography variant="h2" mt={3}>
              Loading ...
            </Typography>
          ) : (
            messages.map((message) =>
              !message.inappropriate ? (
                <Grid mt={2} item xs={4} key={message.id}>
                  <MessageCard {...message} />
                </Grid>
              ) : null
            )
          )}
        </Grid>
      </Box>
      <Outlet />
    </>
  )
}
