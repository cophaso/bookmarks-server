require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const bookmarksRouter = require('./bookmarks/bookmarks-router')
const errorHandler = require('./error-handler');
const validateBearerToken = require('./validate-bearer-token')
const BookmarksService = require('./bookmarks-service')

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

app.get('/bookmarks', (req, res, next) => {
  const knexInstance = req.app.get('db')
  BookmarksService.getAllBookmarks(knexInstance)
    .then(bookmarks => {
      res.json(bookmarks)
    })
    .catch(next)
})

app.get('/bookmarks/:bookmarks_id', (req, res, next) => {
  const knexInstance = req.app.get('db')
  BookmarksService.getById(knexInstance, req.params.article_id)
    .then(bookmark => {
      if (!bookmark) {
        return res.status(404).json({
          error: { message: `bookmark doesn't exist` }
        })
      }
      res.json(bookmark)
    })
    .catch(next)
})

module.exports = app