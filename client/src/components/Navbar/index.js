import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

// styles
import { AppBar, Box, Toolbar, Typography, Button, Grid } from '@mui/material'

// context
import { PeerContext } from 'components/App'

const Navbar = () => {
  const { navlinks } = useContext(PeerContext)
  const navigate = useNavigate()

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Grid container justifyContent="space-between">
            <Typography
              variant="h6"
              component="div"
              onClick={() => navigate('/')}
              sx={{ cursor: 'pointer' }}
            >
              Blockchain
            </Typography>

            <Box>
              {navlinks.map((navlink, i) => (
                <Button key={i} color="inherit" onClick={() => navigate(`/${navlink}`)}>
                  {navlink}
                </Button>
              ))}
            </Box>

            <Button color="inherit"></Button>
          </Grid>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Navbar
