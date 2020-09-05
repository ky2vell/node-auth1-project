const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const error = require('./middleware/error');
const colors = require('colors');

const db = require('./data/config');

const welcomeRouter = require('./welcome/welcomeRouter');
const usersRouter = require('./users/user-router');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(
  session({
    name: 'moo',
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    store: new KnexSessionStore({
      knex: db,
      createtable: true
    })
  })
);
server.use(cors());

// API Routes
server.use(welcomeRouter);
server.use('/api', usersRouter);

// Error MiddleWare
server.use(error);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`\n== API running on port ${PORT} ==\n`.yellow.bold);
});
