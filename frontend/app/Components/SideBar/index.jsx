"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button, 
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import Link from 'next/link';

const Index = () => {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    window.location.replace("/LoginSignUp")
  };

  return (
    <Box 
      sx={{
        position: "fixed",  
        top: 0,             
        bottom: 0,          
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
        width: 300,
        backgroundColor: "#000",
        color: "#fff", 
        p: 2,
        zIndex: 1000, 
      }}
    >
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontFamily: "cursive",
            textAlign: "center",
            mb: 2,
          }}
        >
          InstaClone
        </Typography>
        <Divider sx={{ backgroundColor: "#444" }} />
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} href="/HomePage">
              <ListItemIcon style={{ minWidth: "35px" }}>
                <HomeIcon style={{ color: "white", height: "30px", width: "30px" }} />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} href="/UserUpload">
              <ListItemIcon style={{ minWidth: "35px" }}>
                <AddCircleOutlineIcon style={{ color: "white", height: "30px", width: "30px" }} />
              </ListItemIcon>
              <ListItemText primary="Post" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} href="/profile">
              <ListItemIcon style={{ minWidth: "35px" }}>
                <PersonIcon style={{ color: "white", height: "30px", width: "30px" }} />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
          </ListItem>
        </List>
        <Box mt={2} textAlign="center">
          <Button variant="outlined" onClick={handleLogout} style={{ color: "#fff", borderColor: "#fff" }}>
            Logout
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Index;
