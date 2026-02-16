const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
  maxHttpBufferSize: 1e8,
});

app.use(express.static(path.join(__dirname, "public")));

// Store all drawing strokes so new users see existing art
let strokes = [];
const MAX_STROKES = 50000;

// Track connected users
let userCount = 0;

// Assign random colors to users
const USER_COLORS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
  "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9",
  "#F8C471", "#82E0AA", "#F1948A", "#AED6F1", "#D7BDE2",
  "#A3E4D7", "#FAD7A0", "#A9CCE3", "#D5F5E3", "#FADBD8",
];

io.on("connection", (socket) => {
  userCount++;
  const userColor = USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];

  // Send existing canvas state to new user
  socket.emit("canvas-state", strokes);
  io.emit("user-count", userCount);

  // Broadcast drawing data in real-time
  socket.on("draw", (data) => {
    strokes.push(data);
    if (strokes.length > MAX_STROKES) {
      strokes = strokes.slice(-MAX_STROKES);
    }
    socket.broadcast.emit("draw", data);
  });

  // Handle canvas clear
  socket.on("clear-canvas", () => {
    strokes = [];
    io.emit("clear-canvas");
  });

  socket.on("disconnect", () => {
    userCount--;
    io.emit("user-count", userCount);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Universal Draw running on port ${PORT}`);
});const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
  maxHttpBufferSize: 1e8,
});

app.use(express.static(path.join(__dirname, "public")));

// Store all drawing strokes so new users see existing art
let strokes = [];
const MAX_STROKES = 50000;

// Track connected users
let userCount = 0;

// Assign random colors to users
const USER_COLORS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
  "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9",
  "#F8C471", "#82E0AA", "#F1948A", "#AED6F1", "#D7BDE2",
  "#A3E4D7", "#FAD7A0", "#A9CCE3", "#D5F5E3", "#FADBD8",
];

io.on("connection", (socket) => {
  userCount++;
  const userColor = USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];

  // Send existing canvas state to new user
  socket.emit("canvas-state", strokes);
  io.emit("user-count", userCount);

  // Broadcast drawing data in real-time
  socket.on("draw", (data) => {
    strokes.push(data);
    if (strokes.length > MAX_STROKES) {
      strokes = strokes.slice(-MAX_STROKES);
    }
    socket.broadcast.emit("draw", data);
  });

  // Handle canvas clear
  socket.on("clear-canvas", () => {
    strokes = [];
    io.emit("clear-canvas");
  });

  socket.on("disconnect", () => {
    userCount--;
    io.emit("user-count", userCount);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Universal Draw running on port ${PORT}`);
});
