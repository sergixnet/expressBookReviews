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
public_users.get('/', async function (req, res) {
  try {
    const data = await booksService.getAll();
    return res.json(data);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  booksService
    .getByISBN(isbn)
    .then((data) => {
      return res.json(data);
    })
    .catch((err) => {
      const response = { message: err.message };
      return res.status(err?.status || 500).json(response);
    });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  booksService
    .getBooksByAuthor(author)
    .then((data) => {
      return res.json(data);
    })
    .catch((err) => {
      const response = { message: err.message };
      return res.status(err?.status || 500).json(response);
    });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  booksService
    .getBookByTitle(title)
    .then((data) => {
      return res.json(data);
    })
    .catch((err) => {
      const response = { message: err.message };
      return res.status(err?.status || 500).json(response);
    });
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
