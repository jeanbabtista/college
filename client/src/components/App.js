import React, { useState, useEffect, createContext } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// styling
import { Container, CssBaseline } from '@mui/material'

// components
import Navbar from 'components/Navbar'
import Peers from 'components/Peers'
import Home from 'components/Home'
import Dashboard from 'components/Dashboard'
import Mine from 'components/Mine'

// context
export const PeerContext = createContext()

const App = () => {
  const [numberOfPeers, setNumberOfPeers] = useState(1)
  const [peers, setPeers] = useState([])

  useEffect(
    () => setPeers([...Array(numberOfPeers)].map((_, i) => ({ index: i, port: 5000 + i }))),
    [numberOfPeers]
  )

  const contextData = {
    numberOfPeers,
    setNumberOfPeers,
    peers,
    setPeers,
    navlinks: ['peers', 'mine', 'dashboard'],
  }

  return (
    <PeerContext.Provider value={contextData}>
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
    </PeerContext.Provider>
  )
}

export default App
