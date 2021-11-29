import React from 'react'
import Box from '@mui/material/Box'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import AccountCircle from '@mui/icons-material/AccountCircle'

export default function IconInput({ label, onChange, onKeyPress }) {
  return (
    <Box sx={{ m: 1 }}>
      <FormControl variant="standard">
        <InputLabel>{label}</InputLabel>
        <Input
          startAdornment={
            <InputAdornment position="start">
              <AccountCircle />
            </InputAdornment>
          }
          onChange={onChange}
          onKeyPress={onKeyPress}
        />
      </FormControl>
    </Box>
  )
}
