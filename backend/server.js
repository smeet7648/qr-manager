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

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"));

app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);

io.on("connection", (socket) => {
  console.log("Teacher Connected");

  socket.on("disconnect", () => {
    console.log("Disconnected");
  });
});

server.listen(process.env.PORT, () => {
  console.log("Server Running");
});