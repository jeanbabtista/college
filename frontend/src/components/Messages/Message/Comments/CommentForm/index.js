import { useContext, useState } from 'react'
import { GlobalContext } from '../../../../../context'
import { Box, Grid, Typography, Button, TextField } from '@mui/material'
import { toast } from 'react-toastify'
import { create } from '../../../../../api/comment'

export default function CommentForm({ messageId, setComments }) {
  const { getUser } = useContext(GlobalContext)
  const currentUser = getUser()

  const [comment, setComment] = useState({ text: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const { error, message, data } = await create(messageId, currentUser.id, comment.text)

      console.log('created comment:', data)

      if (error) {
        toast.error(message, {
          position: toast.POSITION.TOP_CENTER,
        })

        return
      }

      toast.success(message, {
        position: toast.POSITION.TOP_CENTER,
      })

      setComments((comments) => [data, ...comments])
    } catch (e) {
      toast.error(e.message, {
        position: toast.POSITION.TOP_CENTER,
      })
    }
  }

  if (!currentUser) return null

  return (
    <Box mt={1}>
      <Typography component="h1" variant="h5">
        Post a comment
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="text"
              required
              fullWidth
              id="text"
              label="Text"
              onChange={(e) => setComment({ ...comment, text: e.target.value })}
              autoFocus
            />
          </Grid>
        </Grid>
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Post
        </Button>
      </Box>
    </Box>
  )
}
