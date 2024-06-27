"use client"
import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  CircularProgress,
  TextField,
} from "@mui/material";
import axios from "axios";

const UserUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);

  // Check for token only on the client-side
  const checkToken = typeof window !== "undefined" ? localStorage.getItem("auth-token") : null;

  const [postdata, setPostData] = useState({
    token: checkToken,
    image_url: "",
    caption: "",
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024 && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    } else {
      alert("Please select an image file (jpg, png) less than 5MB.");
    }
  };

  const handleCaptionChange = (e) => {
    setPostData({ ...postdata, caption: e.target.value });
  };

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await axios.post("https://insta-clone-e6rm.onrender.com/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data.image_url;
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file.");
      throw error;
    }
  };

  const savePostData = async (image_url) => {
    const dataToPost = { ...postdata, image_url };

    try {
      const postResponse = await axios.post("https://insta-clone-e6rm.onrender.com/addimage", dataToPost, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(postResponse.data.message);
      alert(postResponse.data.message);
    } catch (error) {
      console.error("Error saving image and caption:", error);
      alert("Error saving image and caption.");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("No file selected!");
      return;
    }

    setUploading(true);
    try {
      const image_url = await uploadFile();
      await savePostData(image_url);
    } catch (error) {
      console.error("Error during upload or save process:", error);
    } finally {
      setUploading(false);
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
          border: "2px solid #fff",
          color: "#fff",
        }}
      >
        <Typography
          component="h2"
          variant="h4"
          sx={{
            fontFamily: "cursive",
            mb: 2,
          }}
        >
          Upload Image
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1, width: "100%" }}>
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{ mb: 2 }}
          >
            Choose Image
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
          {preview && (
            <Box sx={{ mb: 2 }}>
              <img
                src={preview}
                alt="Selected"
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "300px",
                  borderRadius: "8px",
                }}
              />
            </Box>
          )}
          <Typography
            variant="h6"
            sx={{
              fontFamily: "cursive",
              mb: 2,
              fontSize: 15,
            }}
          >
            Caption:
          </Typography>
          <TextField
            variant="outlined"
            fullWidth
            margin="normal"
            value={postdata.caption}
            name="caption"
            onChange={handleCaptionChange}
            InputProps={{
              style: { color: "#fff", border: "1px solid #fff" },
            }}
          />
          <Button
            type="button"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? <CircularProgress size={24} /> : "Upload"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default UserUpload;
