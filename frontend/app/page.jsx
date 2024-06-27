"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import { RiInstagramFill } from "react-icons/ri";

const IndexPage = () => {
  const router = useRouter();
  const [colorIndex, setColorIndex] = useState(0);
  const colors = ['red', 'blue', 'green', 'yellow']; 

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      router.push('/HomePage');
    } else {
      router.push('/LoginSignUp');
    }
  }, [router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
    }, 1000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#000',
      }}
    >
      <Box
        sx={{
          color: colors[colorIndex], 
          fontSize: '100px',
          transition: 'color 0.3s ease',
        }}
      >
        <RiInstagramFill />
      </Box>
      <Typography variant="h5" sx={{ color: '#fff', mt: 2 }}>Loading...</Typography>
    </Box>
  );
};

export default IndexPage;
