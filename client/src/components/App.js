import React, { useState, useEffect, createContext } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// styling
import { Container, CssBaseline } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'

// components
import Navbar from 'components/Navbar'
import Peers from 'components/Peers'
import Home from 'components/Home'
import Dashboard from 'components/Dashboard'
import Mine from 'components/Mine'

// context
export const PeerContext = createContext()

// theme
const theme = createTheme({
  palette: {
    mode: 'dark',
  },
})

/* --- peer structure ---
peer: Object {
  id: int
  port: int
}

connection: Array [
  {
    port: int
    to: Array [
      { port: int, connected: Bool }
      { port: int, connected: Bool }
      ...
    ]
  }
]
*/

const App = () => {
  const [numberOfPeers, setNumberOfPeers] = useState(3)
  const [peers, setPeers] = useState([])
  const [connections, setConnections] = useState([])

  useEffect(
    () => setPeers([...Array(numberOfPeers)].map((_, i) => ({ id: i + 1, port: 5000 + i }))),
    [numberOfPeers]
  )

  useEffect(
    () =>
      setConnections(
        peers.map((peer) => ({
          port: peer.port,
          to: peers.map((p) => ({ port: p.port, connected: p.id === peer.id })),
        }))
      ),
    [peers]
  )

  /* useEffect(() => {
    console.log('Available connections:')
    connections.forEach(({ port: from, to }) =>
      to.forEach(
        ({ port: to, connected }) => connected && from !== to && console.log(`${from} -> ${to}`)
      )
    )
  }, [connections]) */

  const contextData = {
    numberOfPeers,
    setNumberOfPeers,
    peers,
    setPeers,
    connections,
    setConnections,
    navlinks: ['peers', 'mine', 'dashboard'],
  }

  return (
    <PeerContext.Provider value={contextData}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Navbar />
          <Container sx={{ mt: 8 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/peers" element={<Peers />} />
              <Route path="/mine" element={<Mine />} />
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
