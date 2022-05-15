import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom'
import { Container, CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from './mui/theme'
import { GlobalContext } from './context'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Welcome from './components/Welcome'
import Navbar from './components/Navbar'
import Login from './components/Login'
import Register from './components/Register'
import Messages from './components/Messages'
import Message from './components/Messages/Message'
import User from './components/User'

export default function App() {
  const [stateUser, setStateUser] = useState(null)

  const setUser = (user) => {
    setStateUser(user)

    if (!user) localStorage.removeItem('user')
    else localStorage.setItem('user', JSON.stringify(user))
  }

  const getUser = () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  }

  useEffect(() => setUser(getUser()), [])

  const value = {
    setUser,
    getUser,
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalContext.Provider value={value}>
        <BrowserRouter>
          <Navbar />
          <Container>
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/messages/:id" element={<Message />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/user/:id" element={<User />} />
              <Route
                path="*"
                element={
                  <main style={{ padding: '1rem' }}>
                    <p>There's nothing here!</p>
                  </main>
                }
              />
            </Routes>
          </Container>
          <CssBaseline />
          <ToastContainer />
        </BrowserRouter>
      </GlobalContext.Provider>
    </ThemeProvider>
  )
}
