import { useNavigate } from 'react-router-dom'
import { Typography, Button } from '@mui/material'

export default function Welcome() {
  const navigate = useNavigate()

  return (
    <>
      <Typography variant="h2">Welcome!</Typography>
      <Button onClick={() => navigate('/messages')}>Browse messages</Button>
    </>
  )
}
