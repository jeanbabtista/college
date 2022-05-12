import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Container, CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from './mui/theme'
import Navbar from './components/Navbar'
import { GlobalContext } from './context'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Login from './components/Login'
import Register from './components/Register'

export default function App() {
  const [user, setUser] = useState(null)

  const value = {
    user,
    setUser,
  }

  useEffect(() => {
    console.log(user)
  }, [user])

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <GlobalContext.Provider value={value}>
          <Navbar />

          <Container>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </Container>
        </GlobalContext.Provider>
      </ThemeProvider>

      <CssBaseline />
      <ToastContainer />
    </BrowserRouter>
  )
}
