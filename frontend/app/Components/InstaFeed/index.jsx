'use client';
import React from 'react';
import { useUser } from '@/app/Context/UserContext';
import { Container, Typography } from '@mui/material';
import ImageContainer from "../ImageContainer";

const InstaFeed = () => {
  const { posts } = useUser();

  return (
    <Container sx={{ width: '500px', overflow: 'hidden', backgroundColor: 'black', margin: '0px',position:"absolute",top:0,left:"20%" }}>
      <Typography variant="h4" component="h5" gutterBottom sx={{ color: '#fff',textAlign:"center",marginTop:"20px" }}>
        Posts
      </Typography>
      {
        Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post) => (
            <ImageContainer
              key={post._id}
              _id={post._id}
              username={post.username}
              image={post.image}
              likes={post.likes}
              comments={post.comments}
              caption={post.caption}
            />
          ))
        ) : (
          <Typography variant="body1" sx={{ color: '#fff' }}>
            No posts available.
          </Typography>
        )
      }
    </Container>
  );
};

export default InstaFeed;
