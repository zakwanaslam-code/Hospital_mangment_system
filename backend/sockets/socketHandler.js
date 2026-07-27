// Real-time events yahan register honge — Step 12 me poora wire karenge
// (naya appointment, low stock alert, lab report ready, etc.)

export const initSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    socket.on('join', (userId) => {
      socket.join(userId); // per-user room — targeted notifications ke liye
    });

    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
};
