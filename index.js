const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// const express = require("express");
// const app = express();
// const http = require("http").createServer(app);
// const io = require("socket.io")(http);

// const PORT = 3000;

// Object to keep track of user connections, their gameIds, and userIds
const userGameMap = {};

io.on("connection", (socket) => {
  console.log("A user connected");

  // Handling user joining with gameId and userId
  socket.on("joinGame", ({ gameId, userId }) => {
    console.log(`User ${userId} joined game with ID: ${gameId}`);
    userGameMap[socket.id] = { gameId, userId };
  });

  // Handling user disconnection
  socket.on("disconnect", () => {
    const userInfo = userGameMap[socket.id];
    if (userInfo) {
      console.log(
        `User ${userInfo.userId} with socket ID ${socket.id} disconnected from game ${userInfo.gameId}`,
      );
      // Remove the user from the map
      delete userGameMap[socket.id];
    }
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// const express = require("express");
// const app = express();
// const http = require("http").createServer(app);
// const io = require("socket.io")(http);

// const PORT = 3000;

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });

// let usersInRooms = {};

// io.on("connection", (socket) => {
//   console.log("A user connected");

//   // console.log(io.sockets.adapter);

//   // Find or create a room with two users
//   let room;
//   const rooms = io.sockets.adapter.rooms;
//   for (const [roomId, data] of rooms) {
//     if (data.size === 1) {
//       room = roomId;
//       break;
//     }
//   }

//   // If no available room, create a new one
//   if (!room) {
//     room = socket.id;
//   }

//   // Join the room
//   socket.join(room);
//   usersInRooms[socket.id] = room;

//   // Notify the user which room they are in
//   socket.emit("roomAssignment", room);

//   // Handle disconnect event
//   socket.on("disconnect", () => {
//     const roomId = usersInRooms[socket.id];
//     console.log(`A user disconnected  ${roomId}`);
//     socket.leave(roomId);
//     delete usersInRooms[socket.id];
//   });
// });
// io.on("connection", (socket) => {
//   console.log("connected!");

//   // socket.on("joinRoom", async ({roomId}) => {

//   //   if (io.sockets.adapter.rooms.get(roomId)?.size < 2) {
//   //     socket.join(roomId);
//   //     console.log(`User ${socket.id} joined room ${roomId}`);
//   //   } else {
//   //     console.log(`Room ${roomId} is full`);
//   //   }
//   // });

//   // // Handle user disconnection
//   // socket.on("disconnect", () => {
//   //   console.log("A user disconnected");
//   // });

//   socket.on("createRoom", async ({ nickname }) => {
//     console.log(nickname);
//     try {
//       // room is created
//       let room = new Room();
//       console.log("new room - ", room);
//       let player = {
//         socketID: socket.id,
//         nickname,
//         playerType: "X",
//       };
//       room.players.push(player);
//       room.turn = player;
//       // room.isJoin = false;
//       room = await room.save();
//       // console.log("this is room", room);
//       const roomId = room._id.toString();

//       socket.join(roomId);
//       // io -> send data to everyone
//       // socket -> sending data to yourself
//       io.to(roomId).emit("createRoomSuccess", room);
//     } catch (e) {
//       console.log(e);
//     }
//   });

//   socket.on("joinRoom", async ({ nickname, roomId }) => {
//     try {
//       if (!roomId.match(/^[0-9a-fA-F]{24}$/)) {
//         console.log("inside");
//         // console.log("socket -", socket);
//         socket.emit("errorOccurred", "Please enter a valid room ID.");
//         return;
//       }
//       let room = await Room.findById(roomId);
//       // room.isJoin = false;
//       // room.save();
//       console.log(room.isJoin);
//       if (room.isJoin) {
//         let player = {
//           nickname,
//           socketID: socket.id,
//           playerType: "O",
//         };
//         socket.join(roomId);
//         room.players.push(player);
//         // room.isJoin = false;
//         room = await room.save();
//         io.to(roomId).emit("joinRoomSuccess", room);
//         io.to(roomId).emit("updatePlayers", room.players);
//         io.to(roomId).emit("updateRoom", room);
//       } else {
//         socket.emit(
//           "errorOccurred",
//           "The game is in progress, try again later.",
//         );
//       }
//     } catch (e) {
//       console.log(e);
//     }
//   });

//   socket.on("tap", async ({ index, roomId }) => {
//     try {
//       let room = await Room.findById(roomId);

//       let choice = room.turn.playerType; // x or o
//       if (room.turnIndex == 0) {
//         room.turn = room.players[1];
//         room.turnIndex = 1;
//       } else {
//         room.turn = room.players[0];
//         room.turnIndex = 0;
//       }
//       room = await room.save();
//       io.to(roomId).emit("tapped", {
//         index,
//         choice,
//         room,
//       });
//     } catch (e) {
//       console.log(e);
//     }
//   });

//   socket.on("winner", async ({ winnerSocketId, roomId }) => {
//     try {
//       let room = await Room.findById(roomId);
//       let player = room.players.find(
//         (playerr) => playerr.socketID == winnerSocketId,
//       );
//       player.points += 1;
//       room = await room.save();

//       if (player.points >= room.maxRounds) {
//         io.to(roomId).emit("endGame", player);
//       } else {
//         io.to(roomId).emit("pointIncrease", player);
//       }
//     } catch (e) {
//       console.log(e);
//     }
//   });
// });

// http.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
