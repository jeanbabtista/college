import React, { useState, useEffect, createContext, useMemo } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import axios from 'axios'

// styling
import { Container, CssBaseline } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'

// components
import Navbar from 'components/Navbar'
import Peers from 'components/Peers'
import Home from 'components/Home'
import Dashboard from 'components/Dashboard'

// context
export const PeerContext = createContext()
axios.defaults.timeout = 5000

// theme
const theme = createTheme({
  palette: {
    mode: 'dark',
  },
})

const App = () => {
  const [numberOfPeers, setNumberOfPeers] = useState(3)
  const [peers, setPeers] = useState([])
  const [connections, setConnections] = useState([])

  useEffect(
    () =>
      setPeers(
        [...Array(numberOfPeers).keys()].map((i) => ({
          id: i + 1,
          port: 5000 + i,
        })),
      ),
    [numberOfPeers],
  )

  useEffect(
    () =>
      setConnections(
        peers.map((peer) => ({
          port: peer.port,
          to: peers.map((p) => ({ port: p.port, connected: true, actuallyConnected: false })),
        })),
      ),
    [peers],
  )

  const contextData = useMemo(
    () => ({
      numberOfPeers,
      setNumberOfPeers,
      peers,
      setPeers,
      connections,
      setConnections,
      navlinks: ['peers', 'dashboard'],
    }),
    [numberOfPeers, peers, connections],
  )

  return (
    <PeerContext.Provider value={contextData}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Navbar />
          <Container sx={{ mt: 8 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/peers" element={<Peers />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </Container>
        </BrowserRouter>
        <CssBaseline />
      </ThemeProvider>
    </PeerContext.Provider>
  )
}

export default App
