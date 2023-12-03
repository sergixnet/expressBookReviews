const books = require('./booksdb.js');

const getAll = () => Promise.resolve(books);
const getByISBN = (isbn) => {
  if (books[isbn]) {
    return Promise.resolve(books[isbn]);
  } else {
    return Promise.reject({ message: 'Book not found', status: 400 });
  }
};

module.exports = {
  getAll,
  getByISBN,
};
