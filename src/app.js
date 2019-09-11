require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const bookmarksRouter = require('./bookmarks/bookmarks-router')
const errorHandler = require('./error-handler');
const validateBearerToken = require('./validate-bearer-token')

const { NODE_ENV } = require('./config');

const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(errorHandler);
app.use(validateBearerToken);
app.use(bookmarksRouter);

app.get('/', (req,res) => {
  res.send('Welcome to the Bookmarks Server!')
});

module.exports = app