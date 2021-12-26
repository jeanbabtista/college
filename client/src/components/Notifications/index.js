import React from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Notification = ({ timeout }) => {
  return (
    <ToastContainer
      theme="dark"
      position="top-right"
      autoClose={timeout || 3000}
      closeOnClick
      pauseOnHover
    />
  )
}

export default Notification
