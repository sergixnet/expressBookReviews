const books = require('./booksdb.js');

const getAll = () => Promise.resolve(books);
const getByISBN = (isbn) => {
  if (books[isbn]) {
    return Promise.resolve(books[isbn]);
  } else {
    return Promise.reject({ message: 'Book not found', status: 400 });
  }
};

const getBooksByAuthor = (author) => {
  const isbns = Object.keys(books);
  let result = [];
  for (let isbn of isbns) {
    if (books[isbn].author === author) {
      result.push(books[isbn]);
    }
  }
  if (result.length > 0) {
    return Promise.resolve(result);
  } else {
    return Promise.reject({
      message: 'Books with this author not found',
      status: 404,
    });
  }
};

module.exports = {
  getAll,
  getByISBN,
  getBooksByAuthor,
};
