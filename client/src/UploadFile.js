import React, { useState } from 'react'
import axios from 'axios'

// mui
import { Grid, Button, Typography } from '@mui/material'

const UploadFile = ({ urlFrom, urlTo }) => {
  const [file, setFile] = useState('')

  const handleFile = (e) => setFile(e.target.files[0])

  const handleUpload = async (e) => {
    e.preventDefault()

    const data = new FormData()
    data.append('file', file)
    data.append('urlTo', urlTo)
    data.append('urlFrom', urlFrom)

    try {
      const upload = `${urlFrom}/upload`
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
      <Grid container flexDirection="column" spacing={3}>
        <Grid item>
          <Typography variant="h2">Upload file</Typography>
          <input type="file" name="file" onChange={handleFile} />
        </Grid>
        <Grid item>
          <Button type="submit" variant="contained">
            Send
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default UploadFile
