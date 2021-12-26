import React, { useContext } from 'react'

// styles
import { Box, Checkbox, FormControl, FormLabel, FormGroup, FormControlLabel } from '@mui/material'

// context
import { PeerContext } from 'components/App'

const Checkboxes = ({ id, port }) => {
  const { peers, connections, setConnections } = useContext(PeerContext)

  const handleChange = (e) => {
    const newConnectionPort = parseInt(e.target.name)

    /* Updates connections, after update peer's connection's to[] array's connected property changes to true or false */
    setConnections(
      connections.map((connection) =>
        // port matches current card's port, update checkbox list
        connection.port === port
          ? {
              ...connection,
              to: peers.map((peer) => {
                const found = connection.to.find((p) => p.port === peer.port)
                return peer.port === newConnectionPort
                  ? {
                      ...found,
                      connected: !found.connected,
                    }
                  : found
              }),
            }
          : connection
      )
    )
  }

  return (
    <FormControl>
      <FormLabel component="legend" sx={{ mt: 3 }}>
        Choose connections to other nodes
      </FormLabel>
      <FormGroup>
        {peers.map((peer, i) =>
          peer.id !== id ? (
            <FormControlLabel
              key={i}
              label={`Connect to ${peer.port}`}
              name={`${peer.port}`}
              control={<Checkbox onChange={handleChange} />}
            />
          ) : (
            <Box key={i} sx={{ width: 0, height: 0 }} />
          )
        )}
      </FormGroup>
    </FormControl>
  )
}

export default Checkboxes
