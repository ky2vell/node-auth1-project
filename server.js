const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const welcomeRouter = require('./welcome/welcomeRouter');
const error = require('./middleware/error');
const colors = require('colors');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

// API Routes
server.use(welcomeRouter);

// Error MiddleWare
server.use(error);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`\n== API running on port ${PORT} ==\n`.yellow.bold);
});
