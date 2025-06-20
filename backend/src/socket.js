function registerSocket(io) {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // test
    socket.emit('welcome', { message: 'Hello from server' });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  global._io = io;
}

module.exports = { registerSocket };
