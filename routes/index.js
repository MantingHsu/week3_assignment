const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');

// Add these for authentication
const auth = require('http-auth');
const path = require('path');

// Set up HTTP authentication using the users.htpasswd file
const basic = auth.basic({
  file: path.join(__dirname, '../users.htpasswd') // path to your htpasswd file
});

// GET: Render registration form
router.get('/register', (req, res) => {
  res.render('form');
});

// POST: Save registration data
router.post('/register', async (req, res) => {
  try {
    const registration = new Registration({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone
    });

    await registration.save();
    // To use the "Thank you" page, uncomment below and create views/thankyou.pug
    // res.render('thankyou');
    // Or use this simple message:
    res.send('Thank you for registering!');
  } catch (err) {
    res.status(500).send('Error saving registration: ' + err.message);
  }
});

// GET: List all registrations (protected by authentication)
router.get('/registrations', auth.connect(basic), async (req, res) => {
  try {
    const registrations = await Registration.find();
    res.render('registrations', { registrations });
  } catch (err) {
    res.status(500).send('Error retrieving registrations: ' + err.message);
  }
});

module.exports = router;
