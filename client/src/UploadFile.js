import React, { useState } from 'react'
import axios from 'axios'

// mui
import { Button } from '@mui/material'

const UploadFile = ({ url }) => {
  const [file, setFile] = useState('')

  const handleFile = (e) => setFile(e.target.files[0])

  const handleUpload = async (e) => {
    e.preventDefault()

    const data = new FormData()
    data.append('file', file)

    try {
      const upload = `${url}/upload`
      const response = await axios.post(upload, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      console.log('File sent successfully:', response)
    } catch (e) {
      console.log('Error:', e.message)
    }
  }

  return (
    <form onSubmit={handleUpload}>
      <h1>Upload file:</h1>
      <input type="file" name="file" onChange={handleFile} />
      <Button type="submit" variant="contained">
        Upload
      </Button>
    </form>
  )
}

export default UploadFile
