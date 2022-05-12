import React, { useContext } from 'react'
import { AppBar, Box, Button, IconButton, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { GlobalContext } from '../../context'
import { toast } from 'react-toastify'
import { postLogin } from '../../api/auth'

export default function Navbar() {
  const { user, setUser } = useContext(GlobalContext)

  const handleLogin = async () => {
    try {
      const response = await postLogin('asadf', 'asdf')
      const { error, message, data } = response

      if (error) {
        toast.error(message)
        return
      }

      toast.success(message)
      setUser(data)
    } catch (e) {
      toast.error(e.message)
    }
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            News
          </Typography>
          <Button color="inherit" onClick={handleLogin}>
            {user ? user.username : 'Login'}
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
