const express = require('express');
const uuid = require('uuid/v4');
const logger = require('../logger');
const { bookmarks } = require('../store');

const bookmarksRouter = express.Router()

bookmarksRouter
  .route('/bookmarks')
  .get((req, res) => {
    res.json(bookmarks);
  })
  .post((req, res) => {
    const { title, url, description, rating } =req.body;
    const id = uuid();
    const bookmark ={
      id,
      title,
      url,
      description,
      rating
    }

    bookmarks.push(bookmark);

    logger.info(`Bookmark with id ${id} created`);

    res
      .status(201)
      .location(`http://localhost:8000/bookmarks/${id}`)
      .json({id});
  })
  .delete((req, res) => {
    const { id } = req.params;

    const bookmarksIndex = bookmarks.findIndex(bm => bm.id == id);
  
    if (bookmarksIndex === -1) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res
        .status(404)
        .send('404 Not Found');
    }
  
    bookmarks.splice(bookmarksIndex, 1);
  
    logger.info(`Bookmark with id ${id} deleted.`);
    res
      .status(204)
      .end();
  })

bookmarksRouter
  .route('/bookmarks/:id')
  .get((req, res) => {
    const { id } = req.params;
    const bookmark = bookmarks.find(bm => bm.id == id);

    if (!bookmark) {
      logger.error(`bookmark with id ${id} not found`);
      return res.status(404).send('404 Not Found');
    }

    res.json(bookmark);
  })

  module.exports = bookmarksRouter;