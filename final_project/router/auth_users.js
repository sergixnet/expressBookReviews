const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  const validUsers = users.filter(
    (user) => user.username === username && user.password === password
  );
  return validUsers.length > 0;
};

//only registered users can login
regd_users.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required' });
  }
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: 'Invalid credentials!!' });
  }

  let accessToken = jwt.sign(
    {
      data: password,
    },
    'access',
    { expiresIn: 60 * 60 }
  );
  req.session.authorization = {
    accessToken,
    username,
  };
  return res.status(200).json({ message: 'Logged in successfully' });
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  const { username } = req.session.authorization;
  if (!username) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  book.reviews[username] = req.body.review;
  return res.json(book.reviews);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
