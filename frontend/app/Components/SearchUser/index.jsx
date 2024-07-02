import React from 'react';
import { Box, TextField, Typography, styled } from '@mui/material';

const SearchTextField = styled(TextField)({
  '& label': {
    color: 'white',
  },
  '& input': {
    color: 'white',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'white',
    },
    '&:hover fieldset': {
      borderColor: 'white',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'white',
    },
  },
});

const Index = () => {
  return (
    <Box 
      sx={{ 
        position: 'fixed', 
        top: 0, 
        left: '70%', 
        transform: 'translateX(-50%)',
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center',
        p: 2,
        color: "white"
      }}
    >
      <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
        Search Profile
      </Typography>
      <SearchTextField 
        label="Search" 
        variant="outlined"
        InputLabelProps={{
          style: { color: 'white' },
        }}
        InputProps={{
          style: { color: 'white' },
        }}
      />
    </Box>
  );
}

export default Index;
