import { useState } from 'react'
import { Box, Typography } from '@mui/material'

import { printDate } from '../../../../utils/date'
import CommentForm from './CommentForm'
import Comment from './Comment'

export default function Comments({ messageId, comments }) {
  const [commentsList, setCommentsList] = useState(comments)

  if (!comments.length)
    return (
      <Box>
        <CommentForm messageId={messageId} setComments={setCommentsList} />
        <Typography variant="p">No comments yet!</Typography>
      </Box>
    )

  return (
    <Box>
      <CommentForm messageId={messageId} setComments={setCommentsList} />
      {commentsList.map((comment) => (
        <Comment
          key={comment._id}
          id={comment._id}
          text={comment.text}
          username={comment.user.username}
          date={comment.createdAt}
        />
      ))}
    </Box>
  )
}
