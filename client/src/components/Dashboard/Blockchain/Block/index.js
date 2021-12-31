import React, { memo } from 'react'

// styles
import { Box, Card, CardContent, CardActions, Typography } from '@mui/material'

const Block = ({ index, nonce, previousHash, hash, data, timestamp }) => {
  console.log('Block')

  return (
    <Box m={3}>
      <Card>
        <CardContent>
          <Typography variant="p" component="div">
            Previous hash: {previousHash === '0' ? '0' : previousHash.substring(0, 10)}
          </Typography>
          <Typography variant="p" component="div">
            Nonce: {nonce}
          </Typography>
          <Typography variant="p" component="div">
            Data: {data}
          </Typography>
          <Typography variant="p" component="div">
            Timestamp: {timestamp}
          </Typography>
          <Typography variant="p" component="div">
            Hash: {hash === '0' ? '0' : hash.substring(0, 10)}
          </Typography>
        </CardContent>
        <CardActions sx={{ borderTop: '1px solid #fff', bgcolor: 'background.paper' }}>
          <Typography variant="h6">Block #{index}</Typography>
        </CardActions>
      </Card>
    </Box>
  )
}

export default memo(Block)
