const books = require('./booksdb.js');

const getAll = () => Promise.resolve(books);
// const getByISBN = (isbn) => Promise.resolve(users.find(u => u.id == id));

module.exports = {
  getAll,
};
