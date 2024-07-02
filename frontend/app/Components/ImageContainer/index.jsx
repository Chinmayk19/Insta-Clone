"use client";
import React, { useState, useEffect } from 'react';
import { useUser } from '@/app/Context/UserContext';
import { Container, Paper, Typography, Box, Button, TextField, Collapse } from '@mui/material';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:4001');

const Index = (props) => {
  const { users } = useUser();
  const [likes, setLikes] = useState(props.likes || []);
  const [comments, setComments] = useState(props.comments || []);
  const [newComment, setNewComment] = useState('');
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [loggedInUsername, setLoggedInUsername] = useState(null);
  const token = localStorage.getItem('auth-token');
  const [showAllComments, setShowAllComments] = useState(false);

  useEffect(() => {
    if (token && Array.isArray(users)) {
      const user = users.find(user => user.token === token);
      if (user) {
        setLoggedInUsername(user.username);
      }
    }
  }, [token, users]);
  const hasLiked = likes.includes(loggedInUsername);

  useEffect(() => {
    socket.on('update_likes', ({ postId, likes }) => {
      if (postId === props._id) {
        setLikes(likes);
      }
    });

    socket.on('update_comments', ({ postId, comments }) => {
      if (postId === props._id) {
        setComments(comments);
      }
    });

    return () => {
      socket.off('update_likes');
      socket.off('update_comments');
    };
  }, [props._id]);

  const handleLike = async () => {
    try {
      if (hasLiked) {
        await axios.post('http://localhost:4001/unlike-img', { postId: props._id, username: loggedInUsername });
      } else {
        await axios.post('http://localhost:4001/like-img', { postId: props._id, username: loggedInUsername });
      }
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    }
  };

  const handleComment = async () => {
    try {
      await axios.post('http://localhost:4001/comment-img', { postId: props._id, username: loggedInUsername, comment: newComment });
      setNewComment('');
      setShowCommentBox(false);
    } catch (error) {
      console.error('Error commenting on post:', error);
    }
  };

  const getInitial = (username) => {
    return username ? username.charAt(0).toUpperCase() : '';
  };

  const handleShowAllComments = () => {
    setShowAllComments(!showAllComments);
  };

  return (
    <Paper
      key={props._id}
      elevation={3}
      sx={{
        padding: 2,
        marginBottom: 2,
        backgroundColor: 'transparent',
        boxShadow: 'none',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 1,
            color: '#000',
            fontWeight: 'bold',
          }}
        >
          {getInitial(props.username)}
        </Box>
        <Typography variant="h6" component="h3" sx={{ color: '#fff' }}>
          {props.username}
        </Typography>
      </Box>
      <Box sx={{ textAlign: 'center', marginY:2 }}>
        <img
          src={props.image}
          style={{
            width: '400px',
            height: '400px',
            objectFit: 'cover',
            borderRadius: '2px',
          }}
        />
      </Box>
      <Typography variant="body1" sx={{ color: '#fff' }}>
      Caption - {props.caption}
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ color: '#fff' }}>
        Likes: {likes.length}
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ color: '#fff' }}>
        Comments: {comments.length}
      </Typography>
      <Box sx={{ display: 'flex', mt: 2 }}>
        <Button onClick={handleLike} sx={{ color: '#fff' }}>
          {hasLiked ? 'Unlike' : 'Like'}
        </Button>
        <Button onClick={() => setShowCommentBox(!showCommentBox)} sx={{ color: '#fff', ml: 1 }}>
          Comment
        </Button>
      </Box>
      {showCommentBox && (
        <Box sx={{ mt: 2 }}>
          <TextField
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            label="Write a comment"
            variant="outlined"
            fullWidth
            sx={{ mb: 1 }}
            InputProps={{
              style: {
                color: '#fff',
              },
            }}
            InputLabelProps={{
              style: {
                color: '#fff',
              },
            }}
          />
          <Button onClick={handleComment} variant="contained" sx={{ color: '#fff' }}>
            Post Comment
          </Button>
        </Box>
      )}
      <Box sx={{ mt: 2 }}>
        {comments.slice(0, 2).map((comment, index) => (
          <Box key={index} sx={{ mb: 1 }}>
            <Typography variant="body2" sx={{ color: '#fff' }}>
              <strong>{comment.username}:</strong> {comment.comment}
            </Typography>
          </Box>
        ))}
        {comments.length > 2 && (
          <Button onClick={handleShowAllComments} sx={{ color: '#fff' }}>
            {showAllComments ? 'Hide Comments' : 'View All Comments'}
          </Button>
        )}
        <Collapse in={showAllComments}>
          {comments.slice(2).map((comment, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ color: '#fff' }}>
                <strong>{loggedInUsername}:</strong> {comment.comment}
              </Typography>
            </Box>
          ))}
        </Collapse>
      </Box>
    </Paper>
  );
};

export default Index;
