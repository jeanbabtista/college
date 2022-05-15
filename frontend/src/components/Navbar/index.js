import React, { useContext } from 'react'
import { AppBar, Box, Button, IconButton, Toolbar, Typography } from '@mui/material'
import { GlobalContext } from '../../context'
import { useNavigate } from 'react-router-dom'
import { getLogout } from '../../api/auth'
import { toast } from 'react-toastify'

export default function Navbar() {
  const { setUser, getUser } = useContext(GlobalContext)
  const navigate = useNavigate()
  const user = getUser()

  const handleLogout = async () => {
    const { error, message } = await getLogout()

    if (error) {
      toast.error(error.message, {
        position: toast.POSITION.TOP_CENTER,
      })
      return
    }

    toast.success(message, {
      position: toast.POSITION.TOP_CENTER,
    })

    setUser(null)
    navigate('/login')
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => navigate('/messages')}
          >
            <Typography variant="h6" component="div">
              App
            </Typography>
          </IconButton>
          <Box sx={{ display: 'hidden', flexGrow: 1 }} />
          {user ? (
            <>
              <Typography>{user.username}</Typography>
              <Button onClick={handleLogout} sx={{ marginLeft: '10px' }}>
                Logout
              </Button>
            </>
          ) : (
            <Button onClick={() => navigate('/login')}>Login</Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  )
}
