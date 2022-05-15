import { useState, useEffect } from 'react'
import { Grid, Box, Typography, Chip, IconButton } from '@mui/material'
import { ArrowUpwardOutlined, ArrowDownwardOutlined } from '@mui/icons-material'
import { useParams } from 'react-router-dom'

import { printDate } from '../../../utils/date'
import { findOneById, vote } from '../../../api/message'
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

  const handleUpVote = async () => {
    const { error, message: apiMessage } = await vote(message._id, 'up')

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

  const handleDownVote = async () => {
    console.log('downvote')
  }

  if (loading) return <Typography variant="h3">Loading...</Typography>
  if (error)
    return (
      <Typography variant="p" color="red">
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
          <IconButton onClick={handleUpVote}>
            <ArrowUpwardOutlined />
          </IconButton>

          <Box display="hidden"></Box>

          <IconButton onClick={handleDownVote}>
            <ArrowDownwardOutlined />
          </IconButton>
        </Box>
      </Grid>
      <Grid item xs={8}>
        <Comments messageId={message._id} comments={message.comments} />
      </Grid>
    </Grid>
  )
}
