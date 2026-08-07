// backend/sockets/socketHandler.js

export const initSocket = (io) => {

  io.on("connection", (socket) => {

    console.log("🟢 Socket connected:", socket.id);


    // User specific room join
    socket.on("joinRoom", (userId) => {

      socket.join(userId);

      console.log(
        `User joined room: ${userId}`
      );

    });


    // Disconnect
    socket.on("disconnect", () => {

      console.log(
        "🔴 Socket disconnected:",
        socket.id
      );

    });

  });


};