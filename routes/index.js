const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const auth = require('http-auth');
const path = require('path');

// HTTP Basic Authentication setup
const basic = auth.basic({
  file: path.join(__dirname, '../users.htpasswd')
});

// GET: Render the registration form
router.get('/register', (req, res) => {
  res.render('form');
});

// POST: Handle form submission and save to DB
router.post('/register', async (req, res) => {
  try {
    const registration = new Registration({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone
    });
    await registration.save();
    res.render('thankyou'); // Show thank you page
  } catch (err) {
    res.status(500).send('Error saving registration: ' + err.message);
  }
});

// GET: Show all registrations (protected)
router.get('/registrations', basic.check(async (req, res) => {
  try {
    const registrations = await Registration.find();
    res.render('registrations', { registrations });
  } catch (err) {
    res.status(500).send('Error retrieving registrations: ' + err.message);
  }
}));

// OPTIONAL: Redirect root "/" to registration form
router.get('/', (req, res) => {
  res.redirect('/register');
});

module.exports = router;
