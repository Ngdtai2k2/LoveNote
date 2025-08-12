function registerSocket(io) {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join', (user_id) => {
      socket.join(`user_${user_id}`);
      console.log(`User ${user_id} joined room user_${user_id}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  global._io = io;
}

module.exports = { registerSocket };
