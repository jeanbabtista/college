import { useContext, useState } from 'react'
import { postLogin } from '../../api/auth'
import { toast } from 'react-toastify'
import { Avatar, Box, Button, Grid, Link, TextField, Typography } from '@mui/material'
import { LockOutlined } from '@mui/icons-material'
import { GlobalContext } from '../../context'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const { setUser } = useContext(GlobalContext)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const response = await postLogin(username, password)
    const { error, message, data } = response

    if (error) {
      toast.error(error.message, {
        position: toast.POSITION.TOP_CENTER,
      })

      return
    }

    toast.success(message, {
      position: toast.POSITION.TOP_CENTER,
    })

    const user = { ...data }
    setUser(user)

    navigate('/')
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
        Sign in
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          onKeyUp={(e) => setUsername(e.target.value)}
          autoFocus
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          onKeyUp={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Sign In
        </Button>
        <Grid container>
          <Grid item>
            <Link href="/register" variant="body2">
              Don't have an account? Sign Up
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}
