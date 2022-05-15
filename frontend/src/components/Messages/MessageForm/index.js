import { useEffect, useContext, useState } from 'react'
import { GlobalContext } from '../../../context'
import {
  Box,
  Grid,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
} from '@mui/material'
import { toast } from 'react-toastify'
import { getAll } from '../../../api/tag'
import { create } from '../../../api/message'

export default function MessageForm({ setMessages }) {
  const { getUser } = useContext(GlobalContext)
  const user = getUser()

  const [message, setMessage] = useState({
    title: '',
    imagePath: '',
  })

  const [tags, setTags] = useState([])
  const [tag, setTag] = useState('')

  useEffect(() => {
    ;(async () => {
      const { error, message, data: tags } = await getAll()

      if (error) {
        console.log('Error when setting tags: ', message)
        return
      }

      setTags(tags.map((tag) => tag.title))
    })()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const {
        error,
        message: apiMessage,
        data,
      } = await create(message.title, message.imagePath, user.id, tags)

      if (error) {
        toast.error(apiMessage, {
          position: toast.POSITION.TOP_CENTER,
        })

        return
      }

      toast.success(apiMessage, {
        position: toast.POSITION.TOP_CENTER,
      })

      setMessages((messages) => [data, ...messages])
    } catch (e) {
      toast.error(e.message, {
        position: toast.POSITION.TOP_CENTER,
      })
    }
  }

  const handleCreateTag = async (e) => {
    e.preventDefault()

    if (!tag) return
    setTags([...tags, tag])
  }

  if (!user) return null

  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography component="h1" variant="h5">
        Create new message
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="title"
              required
              fullWidth
              id="title"
              label="Title"
              onChange={(e) => setMessage({ ...message, title: e.target.value })}
              autoFocus
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="tags">Tags</InputLabel>
              <Select
                labelId="tags"
                id="tags"
                multiple
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                input={<OutlinedInput label="Chip" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((tag, i) => (
                      <Chip key={i} label={tag} />
                    ))}
                  </Box>
                )}
              >
                {tags.map((tag, i) => (
                  <MenuItem key={i} value={tag}>
                    {tag}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4} sx={{ width: '100%', height: '100%' }}>
            <Button variant="contained" component="label">
              Upload File
              <input
                type="file"
                name="imagePath"
                onChange={(e) => setMessage({ ...message, imagePath: e.target.files[0] })}
              />
            </Button>
          </Grid>
          <Grid item xs={1}>
            <TextField
              name="tag"
              id="tag"
              label="Tag"
              onChange={(e) => setTag(e.target.value)}
              fullWidth
              autoFocus
            />
          </Grid>
          <Grid item xs={1}>
            <Button fullWidth variant="contained" onClick={handleCreateTag} sx={{ height: '85%' }}>
              Create
            </Button>
          </Grid>
        </Grid>
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Post
        </Button>
      </Box>
    </Box>
  )
}
