import { Card, CardActions, CardContent, CardMedia, Chip, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { printDate } from '../../../utils/date'

export default function MessageCard({
  id,
  title,
  imagePath,
  user: { username },
  tags,
  createdAt: date,
}) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <Link to={`/messages/${id}`}>
        <CardMedia
          component="img"
          height="140"
          image={`http://localhost:5000/${imagePath}`}
          alt={title}
        />
      </Link>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          By {username} on {printDate(date)}
        </Typography>
      </CardContent>
      <CardActions>
        {tags.map(({ title }, i) => (
          <Chip key={i} label={title} />
        ))}
      </CardActions>
    </Card>
  )
}
