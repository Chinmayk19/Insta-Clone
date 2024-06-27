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
        position: "fixed",  // Ensure the sidebar is fixed
        top: 0,             // Align the sidebar to the top of the viewport
        bottom: 0,          // Fill the sidebar vertically from top to bottom
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
        width: 300,
        backgroundColor: "#000", // Black background
        color: "#fff", // White text color
        p: 2,
        zIndex: 1000, // Ensure it appears above other content
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
