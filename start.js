require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
  console.log('Mongoose connection open');
});

mongoose.connection.on('error', (err) => {
  console.log(`Mongoose connection error: ${err.message}`);
});

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Static file middleware (MUST come before routes)
app.use(express.static(path.join(__dirname, 'public')));

// Set up views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Routes
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
