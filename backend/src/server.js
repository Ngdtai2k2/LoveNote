require('module-alias/register');
require('dotenv').config();

const app = require('@root/src/app');
const { connectDB } = require('@config/connectDB');

const PORT = process.env.PORT;

const server = require('http').Server(app);

// Connect to db
connectDB();

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
