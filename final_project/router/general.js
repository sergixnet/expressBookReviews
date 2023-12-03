const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();
const booksService = require('./books-service.js');

public_users.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required' });
  }
  if (users[username]) {
    return res.status(409).json({ message: 'User already exists' });
  }

  users.push({ username, password });
  return res.status(201).json({ message: 'User created successfully' });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  // return res.json(books);

  booksService
    .getAll()
    .then((data) => {
      return res.json(data);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const isbns = Object.keys(books);
  if (isbns.includes(isbn)) {
    return res.json(books[isbn]);
  } else {
    return res.status(404).json({ message: 'Book not found' });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const isbns = Object.keys(books);
  let result = [];
  for (let isbn of isbns) {
    if (books[isbn].author === author) {
      result.push(books[isbn]);
    }
  }
  if (result.length > 0) {
    return res.json(result);
  } else {
    return res
      .status(404)
      .json({ message: 'Books with this author not found' });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const isbns = Object.keys(books);
  let result = [];
  for (let isbn of isbns) {
    if (books[isbn].title === title) {
      result.push(books[isbn]);
    }
  }
  if (result.length > 0) {
    return res.json(result);
  } else {
    return res.status(404).json({ message: 'Books with this title not found' });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const isbns = Object.keys(books);
  if (isbns.includes(isbn)) {
    return res.json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: 'Book not found' });
  }
});

module.exports.general = public_users;
