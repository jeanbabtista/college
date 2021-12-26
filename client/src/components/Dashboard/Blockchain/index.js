import React, { useContext } from 'react'

// styles
import { Grid } from '@mui/material'

// components
import Block from './Block'

const Blockchain = ({ chain }) => {
  return (
    <Grid container>
      {chain.map((block, i) => (
        <Grid item key={i}>
          <Block data={block} />
        </Grid>
      ))}
    </Grid>
  )
}

export default Blockchain
