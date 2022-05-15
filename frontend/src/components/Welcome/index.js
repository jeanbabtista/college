import { useNavigate } from 'react-router-dom'
import { Typography, Button, Box } from '@mui/material'

export default function Welcome() {
  const navigate = useNavigate()

  return (
    <Box mt={4}>
      <Typography variant="h2">Welcome!</Typography>
      <Button onClick={() => navigate('/messages')}>Browse messages</Button>
    </Box>
  )
}
