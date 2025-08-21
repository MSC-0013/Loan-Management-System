const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Loan = require('./models/Loan');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Register user
app.post('/register', (req, res) => {
  User.create(req.body)
    .then(user => res.json(user))
    .catch(err => res.json({ error: err.message }));
});

// Login user
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then(user => {
      if (!user) return res.json({ message: 'User not found' });
      if (user.password !== password) return res.json({ message: 'Invalid credentials' });
      res.json({ message: 'Login successful', user });
    })
    .catch(err => res.json({ error: err.message }));
});

// Get all loans
app.get('/loans', (req, res) => {
  Loan.find()
    .then(loans => res.json(loans))
    .catch(err => res.json({ error: err.message }));
});

// Create loan
app.post('/loans', (req, res) => {
  Loan.create(req.body)
    .then(loan => res.json(loan))
    .catch(err => res.json({ error: err.message }));
});

// Update loan
app.put('/loans/:id', (req, res) => {
  Loan.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(updatedLoan => res.json(updatedLoan))
    .catch(err => res.json({ error: err.message }));
});

// Delete loan
app.delete('/loans/:id', (req, res) => {
  Loan.findByIdAndDelete(req.params.id)
    .then(() => res.json({ message: 'Loan deleted successfully' }))
    .catch(err => res.json({ error: err.message }));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
