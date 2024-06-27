const port = 4001;
const express = require("express");
const app = express();
const validator = require("validator");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const InstaUsers = mongoose.model("InstaUsers", {
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: { type: String },
  userimg: {
    type: Array,
  },
  date: { type: Date, default: Date.now },
  likedimg: {
    type: Array,
  },
  commentedPost: {
    type: Array,
  },
});
const InstaPost = mongoose.model("InstaPost", {
  username: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  likes: {
    type: Array,
  },
  comments: {
    type: Array,
  },
  caption: {
    type: String,
  },
  postedAt: {
    type: Date,
    default: Date.now,
  },
});

mongoose.connect(
  "mongodb+srv://student1234:student1234567890@cluster0.tnajmkf.mongodb.net/onlinetutor"
);

app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
  destination: "./Upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

app.use("/images", express.static("Upload/images"));
app.post("/Upload", upload.single("image"), async (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

app.post("/addimage", async (req, res) => {
  const { token, image_url, caption } = req.body;
  if (!token || !image_url) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const user = await InstaUsers.findOne({ token });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const newImage = {
      image_url,
      caption,
      likes: [],
      comments: [],
    };

    user.userimg.push(newImage);
    await user.save();

    const post = new InstaPost({
      image: image_url,
      username: user.username,
      likes: [],
      comments: [],
      caption: caption,
    });
    await post.save();
    res.status(200).json({ success: true, message: "Posted" });
  } catch (error) {
    console.error("Error saving image and caption:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
app.post("/login", async (req, res) => {
  let user = await InstaUsers.findOne({ username: req.body.username });
  if (user) {
    const passCompare = await bcrypt.compare(req.body.password, user.password);
    if (passCompare) {
      const token = user.token;
      res.json({ success: true, token, message: "Login Successful" });
    } else {
      res.json({ success: false, errors: "Wrong Password" });
    }
  } else {
    res.json({ success: false, errors: "Wrong Email no" });
  }
});

app.post("/SignUp", cors(), async (req, res) => {
  const { email, username, password, confirmPassword } = req.body;
  console.log(req.body);

  if (!email || !username || !password || !confirmPassword) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  if (!validator.isEmail(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter a valid email" });
  }

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Passwords do not match" });
  }

  try {
    const existingUser = await InstaUsers.findOne({ email: email });
    if (existingUser) {
      console.log("ho");
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }
    console.log("hi");

    const existingUsername = await InstaUsers.findOne({ username });
    if (existingUsername) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new InstaUsers({
      email: email,
      username: username,
      password: hashedPassword,
      likedimg: [],
      commentedPost: [],
      userimg: [],
      token: "",
    });
    console.log(req.body);
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, "your_secret_key");

    newUser.token = token;
    await newUser.save();

    return res
      .status(200)
      .json({ success: true, message: "User registered successfully", token });
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/allusers", async (req, res) => {
  try {
    const users = await InstaUsers.find({});
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/instaposts", async (req, res) => {
  try {
    const posts = await InstaPost.find({});
    res.status(200).json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

const server = app.listen(port, () => {
  console.log("Server running on port 4001");
});

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

app.post("/like-img", async (req, res) => {
  const { postId, username } = req.body;
  try {
    const post = await InstaPost.findById(postId);
    if (post) {
      if (!post.likes.includes(username)) {
        post.likes.push(username);
        await post.save();

        const user = await InstaUsers.findOne({ username });
        if (user) {
          user.likedimg.push(postId);
          await user.save();
        }

        io.emit("update_likes", { postId, likes: post.likes });
        return res.status(200).json({ success: true, likes: post.likes });
      }
      return res
        .status(400)
        .json({ success: false, message: "User already liked this post" });
    }
    return res.status(404).json({ success: false, message: "Post not found" });
  } catch (error) {
    console.error("Error liking post:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/unlike-img", async (req, res) => {
  const { postId, username } = req.body;
  try {
    const post = await InstaPost.findById(postId);
    if (post) {
      const index = post.likes.indexOf(username);
      if (index > -1) {
        post.likes.splice(index, 1);
        await post.save();

        const user = await InstaUsers.findOne({ username });
        if (user) {
          const likedImgIndex = user.likedimg.indexOf(postId);
          if (likedImgIndex > -1) {
            user.likedimg.splice(likedImgIndex, 1);
            await user.save();
          }
        }

        io.emit("update_likes", { postId, likes: post.likes });
        return res.status(200).json({ success: true, likes: post.likes });
      }
      return res
        .status(400)
        .json({ success: false, message: "User has not liked this post" });
    }
    return res.status(404).json({ success: false, message: "Post not found" });
  } catch (error) {
    console.error("Error unliking post:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/comment-img", async (req, res) => {
  const { postId, username, comment } = req.body;
  try {
    const post = await InstaPost.findById(postId);
    if (post) {
      post.comments.push({ username, comment });
      await post.save();

      const user = await InstaUsers.findOne({ username });
      if (user && !user.commentedPost.includes(postId)) {
        user.commentedPost.push(postId);
        await user.save();
      }

      io.emit("update_comments", { postId, comments: post.comments });
      return res.status(200).json({ success: true, comments: post.comments });
    }
    return res.status(404).json({ success: false, message: "Post not found" });
  } catch (error) {
    console.error("Error commenting on post:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});
