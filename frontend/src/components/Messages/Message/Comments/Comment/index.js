import { Box, Typography, Grid } from '@mui/material'

import { printDate } from '../../../../../utils/date'

export default function Comment({ id, text, username, date }) {
  return (
    <Box key={id} mt={2}>
      <Typography variant="subtitle1" fontSize={24}>
        {text}
      </Typography>
      <Grid container justifyContent="space-between">
        <Grid item flexGrow={1}>
          <Typography variant="p" fontSize={12}>
            By {username}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="p" fontSize={12}>
            {printDate(date)}
          </Typography>
        </Grid>
      </Grid>

      <hr />
    </Box>
  )
}
