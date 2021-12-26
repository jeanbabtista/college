import React, { useContext } from 'react'

// styles
import { Box, Slider as MuiSlider, Typography, Grid, Input } from '@mui/material'

// context
import { PeerContext } from 'components/App'

const Slider = ({ minPeers, maxPeers }) => {
  const { numberOfPeers, setNumberOfPeers } = useContext(PeerContext)

  const handleSliderChange = (_e, newValue) => setNumberOfPeers(newValue)
  const handleInputChange = (e) => setNumberOfPeers(!e.target.value ? '' : Number(e.target.value))
  const handleBlur = () =>
    setNumberOfPeers(
      numberOfPeers < minPeers ? maxPeers : numberOfPeers > maxPeers ? maxPeers : numberOfPeers
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
            min={minPeers}
            max={maxPeers}
          />
        </Grid>
        <Grid item>
          <Input
            value={numberOfPeers}
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 1,
              min: minPeers,
              max: maxPeers,
              type: 'number',
            }}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default Slider
