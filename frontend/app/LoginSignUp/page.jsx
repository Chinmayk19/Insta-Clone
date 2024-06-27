"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Grid,
  Link as MuiLink,
} from "@mui/material";
import axios from "axios";

const LoginSignUp = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [text, setText] = useState("Login");
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleToggle = () => {
    setIsLogin(!isLogin);
    text === "Login" ? setText("SignUp") : setText("Login");
  };

  const loginAndSignUp = async (e) => {
    e.preventDefault();
    console.log(formData);

    const url =
      text === "SignUp"
        ? "https://insta-clone-e6rm.onrender.com/SignUp"
        : "https://insta-clone-e6rm.onrender.com/Login";

    try {
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = response.data;
      console.log(data);

      if (data.success) {
        localStorage.setItem("auth-token", data.token);
        alert(data.message);
        window.location.replace("/HomePage");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(`Error during ${text.toLowerCase()}.`);
    }
  };
  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={6}
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 4,
          backgroundColor: "#000", 
          border: "2px solid #fff", // White border
          color: "#fff", 
        }}
      >
        <Typography
          component="h2"
          variant="h4"
          sx={{ fontFamily: "cursive", mb: 2 }}
        >
          InstaClone
        </Typography>
        <Typography component="h1" variant="h5">
          {isLogin ? "Login" : "Sign Up"}
        </Typography>
        <Box
          component="form"
          noValidate
          sx={{ mt: 1, width: "100%" }}
          onSubmit={loginAndSignUp}
        >
          {!isLogin && (
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              onChange={changeHandler}
              autoFocus
              InputLabelProps={{ style: { color: "#fff" } }}
              style={{ border: 0 }}
              InputProps={{
                style: {
                  color: "#fff",
                },
              }}
            />
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            onChange={changeHandler}
            autoFocus={isLogin}
            InputLabelProps={{ style: { color: "#fff" } }}
            InputProps={{ style: { color: "#fff" } }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={changeHandler}
            InputLabelProps={{ style: { color: "#fff" } }}
            InputProps={{ style: { color: "#fff" } }}
          />
          {!isLogin && (
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              onChange={changeHandler}
              InputLabelProps={{ style: { color: "#fff" } }}
              InputProps={{ style: { color: "#fff" } }}
            />
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {text}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <MuiLink href="#" variant="body2" onClick={handleToggle}>
                {isLogin
                  ? "Don't have an account? Sign Up"
                  : "Already have an account? Login"}
              </MuiLink>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginSignUp;
