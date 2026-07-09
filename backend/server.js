const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const attendanceRoutes = require("./routes/attendance");

const app = express();

const server = http.createServer(app);

/* Allowed Frontend URLs */

const allowedOrigins = [
  "http://localhost:5173",
  "https://merry-beijinho-ce2cc5.netlify.app",
];

// Express CORS

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

// Socket.IO

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("io", io);

// MongoDB

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));

// Routes

app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);

app.get("/", (req, res) => {
  res.send("Backend Running");
});

// Socket

io.on("connection", (socket) => {
  console.log("User Connected");

  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });
});

// Server

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server Running On ${PORT}`);
});