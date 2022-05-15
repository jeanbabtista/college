import { useState, useEffect } from 'react'
import { Grid, Box, Typography, Chip, IconButton, Button } from '@mui/material'
import { ArrowUpwardOutlined, ArrowDownwardOutlined } from '@mui/icons-material'
import { useParams } from 'react-router-dom'

import { printDate } from '../../../utils/date'
import { findOneById, markInappropriate, vote } from '../../../api/message'
import Comments from './Comments'
import { toast } from 'react-toastify'

export default function Message() {
  const { id } = useParams()

  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    ;(async () => {
      const { error, message, data } = await findOneById(id)

      if (error) setError(message)
      else setMessage(data)

      setLoading(false)
    })()
  }, [id])

  useEffect(() => console.log(message), [message])

  const handleVote = async (option) => {
    const { error, message: apiMessage } = await vote(message._id, option)

    if (error) {
      toast.error(apiMessage, {
        position: toast.POSITION.BOTTOM_RIGHT,
      })

      return
    }

    toast.success(apiMessage, {
      position: toast.POSITION.BOTTOM_RIGHT,
    })
  }

  const handleInappropriate = async () => {
    const { error, message: apiMessage } = await markInappropriate(message._id)

    if (error) {
      toast.error(apiMessage, {
        position: toast.POSITION.BOTTOM_RIGHT,
      })

      return
    }

    toast.success(apiMessage, {
      position: toast.POSITION.BOTTOM_RIGHT,
    })
  }

  if (loading)
    return (
      <Typography mt={4} variant="h2">
        Loading...
      </Typography>
    )

  if (error)
    return (
      <Typography mt={4} variant="h3" color="red">
        {error}
      </Typography>
    )

  return (
    <Grid container mt={6}>
      <Grid item xs={4}>
        <Typography variant="h3">{message.title}</Typography>

        <Typography variant="p">
          By {message.user.username} on {printDate(message.createdAt)}
        </Typography>

        <Box mt={2}>
          {message.tags.map(({ title }, i) => (
            <Chip key={i} label={title} sx={{ ml: 1 }} />
          ))}
        </Box>

        <Box mt={2} ml={1}>
          <img src={`http://localhost:5000/${message.imagePath}`} alt={message.title} width={300} />
        </Box>

        <Box>
          <IconButton onClick={() => handleVote('up')}>
            <ArrowUpwardOutlined />
            <Typography ml={2} variant="p">
              {message.numUpVotes}
            </Typography>
          </IconButton>

          <Box display="hidden"></Box>

          <IconButton onClick={() => handleVote('down')}>
            <ArrowDownwardOutlined />
            <Typography ml={2} variant="p">
              {message.numDownVotes}
            </Typography>
          </IconButton>
        </Box>
      </Grid>
      <Grid item xs={8}>
        <Comments messageId={message._id} comments={message.comments} />
      </Grid>

      <Button onClick={handleInappropriate}>Mark as innapropriate</Button>
    </Grid>
  )
}
