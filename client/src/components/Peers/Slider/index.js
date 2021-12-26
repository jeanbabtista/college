import React, { useContext } from 'react'

// styles
import { Box, Slider as MuiSlider, Typography, Grid, Input } from '@mui/material'

// context
import { PeerContext } from 'components/App'

// config
const MIN_PEERS = 0
const MAX_PEERS = 12

const Slider = () => {
  const { numberOfPeers, setNumberOfPeers } = useContext(PeerContext)

  const handleSliderChange = (_e, newValue) => setNumberOfPeers(newValue)
  const handleInputChange = (e) => setNumberOfPeers(!e.target.value ? '' : Number(e.target.value))
  const handleBlur = () =>
    setNumberOfPeers(
      numberOfPeers < MIN_PEERS ? MIN_PEERS : numberOfPeers > MAX_PEERS ? MAX_PEERS : numberOfPeers
    )

  return (
    <Box sx={{ maxWidth: 250 }}>
      <Typography gutterBottom>Number of peers</Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <MuiSlider
            value={numberOfPeers}
            onChange={handleSliderChange}
            marks
            min={MIN_PEERS}
            max={MAX_PEERS}
          />
        </Grid>
        <Grid item>
          <Input
            value={numberOfPeers}
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 1,
              min: MIN_PEERS,
              max: MAX_PEERS,
              type: 'number',
            }}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default Slider
