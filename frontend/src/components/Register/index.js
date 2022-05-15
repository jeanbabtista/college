import { useState } from 'react'
import { Avatar, Box, Button, Grid, Link, TextField, Typography } from '@mui/material'
import { LockOutlined } from '@mui/icons-material'
import { toast } from 'react-toastify'
import { postRegister } from '../../api/auth'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!username || !password || !email) {
      toast.error('Please fill all fields', {
        position: toast.POSITION.TOP_CENTER,
      })

      return
    }

    const response = await postRegister(username, password, email)
    const { error, message } = response

    if (error) {
      toast.error(error.message, {
        position: toast.POSITION.TOP_CENTER,
      })

      return
    }

    toast.success(message, {
      position: toast.POSITION.TOP_CENTER,
    })

    navigate('/login')
  }

  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <LockOutlined />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign up
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              autoComplete="given-name"
              name="username"
              required
              fullWidth
              id="username"
              label="Username"
              onKeyUp={(e) => setUsername(e.target.value)}
              autoFocus
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              onKeyUp={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              onKeyUp={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </Grid>
        </Grid>
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Sign Up
        </Button>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Link href="/login" variant="body2">
              Already have an account? Sign in
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}
