require('module-alias/register');
require('dotenv').config();

require('./cronjobs/index');

const app = require('@root/src/app');
const { connectDB } = require('@config/connectDB');

const socketIO = require('socket.io');
const { registerSocket } = require('./socket');

const PORT = process.env.APP_PORT;

const server = require('http').Server(app);

// Connect to db
connectDB();

// socket
const io = socketIO(server, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

registerSocket(io);

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
