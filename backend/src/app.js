require('dotenv').config();

const path = require('path');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const i18nextMiddleware = require('i18next-http-middleware');

const i18next = require('./i18n');
const routes = require('./routes');

const app = express();

// cors
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(i18nextMiddleware.handle(i18next));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
app.use('/api/v1', routes);

module.exports = app;
