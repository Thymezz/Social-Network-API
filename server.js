const express = require('express');
const db = require('./config/connection');
const routes = require('./routes');
require('dotenv').config();

const PORT = process.env.PORT || 3001;
const app = express();

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use routes
app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
