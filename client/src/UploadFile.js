import React, { useEffect, useState } from 'react'
import axios from 'axios'

// mui
import { Button } from '@mui/material'

// config
const url = 'http://localhost:5000'

const UploadFile = () => {
  const [file, setFile] = useState('')

  useEffect(() => {
    console.log('file:', file)
  }, [file])

  const handleFile = (e) => {
    setFile(e.target.files[0])
  }

  const handleUpload = async (e) => {
    e.preventDefault()

    const data = new FormData()
    data.append('file', file)
    console.log('uploading data:', data.getAll('file'))

    try {
      const response = await axios.post(`${url}/upload`, data, {
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
      <Button type="submit">Upload</Button>
    </form>
  )
}

export default UploadFile
