const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const PORT = 3000;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

let usersInRooms = {};

io.on("connection", (socket) => {
  console.log("A user connected");

  // Find or create a room with two users
  let room;
  const rooms = io.sockets.adapter.rooms;
  for (const [roomId, data] of rooms) {
    if (data.size === 1) {
      room = roomId;
      break;
    }
  }

  // If no available room, create a new one
  if (!room) {
    room = socket.id;
  }

  // Join the room
  socket.join(room);
  usersInRooms[socket.id] = room;

  // Notify the user which room they are in
  socket.emit("roomAssignment", room);

  // Handle disconnect event
  socket.on("disconnect", () => {
    const roomId = usersInRooms[socket.id];
    console.log(`A user disconnected  ${roomId}`);
    socket.leave(roomId);
    delete usersInRooms[socket.id];
  });
});

http.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
