import React from 'react'

// styles
import { Box, Card, CardContent, CardActions, Typography, TextField } from '@mui/material'

const Block = ({ data: { nonce, hash, data, timestamp } }) => {
  return (
    <Box sx={{ width: 250 }}>
      <Card>
        <CardContent>
          <Typography variant="p" component="div">
            Hash: {hash}
          </Typography>
          <Typography variant="p" component="div">
            Nonce: {nonce}
          </Typography>
          <Typography variant="p" component="div">
            Data: {data}
          </Typography>
        </CardContent>

        <CardActions>
          <Typography variant="p" component="div">
            Timestamp: {timestamp}
          </Typography>
        </CardActions>
      </Card>
    </Box>
  )
}

export default Block
