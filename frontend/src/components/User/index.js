import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Typography, Box } from '@mui/material'

import { findOneById } from '../../api/user'

export default function User() {
  const { id } = useParams()

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    ;(async () => {
      const { error, message, data } = await findOneById(id)

      if (error) setError(message)
      else setUser(data)

      setLoading(false)
    })()
  }, [id])

  useEffect(() => console.log(user), [user])

  if (loading)
    return (
      <Typography mt={4} variant="h2">
        Loading...
      </Typography>
    )

  if (error)
    return (
      <Typography mt={4} variant="h3" color="red">
        {error}
      </Typography>
    )

  return (
    <Box>
      <Typography variant="h2" mt={3}>
        User {user.username}
      </Typography>
      <Typography variant="p">Email: {user.email}</Typography>

      <Typography variant="h3" mt={3}>
        Statistics
      </Typography>
      <Typography variant="h6">Total number of votes on users picture: {user.numVotes}</Typography>
      <Typography variant="h6">Total number of posted messages: {user.numMessages}</Typography>
    </Box>
  )
}
