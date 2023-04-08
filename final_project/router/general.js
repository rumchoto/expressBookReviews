const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } else if (!username || !password) {
    return res.status(404).json({message: "Usrname, password or both are not provided."});
  }
  return res.status(404).json({message: "Unable to register user."});
});

function getAllBooks() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(JSON.stringify(books,null,4));
    }, 2000);
  });
}

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  const allBooksData = await getAllBooks();
  res.send(allBooksData);
});

function getBooksByISBN(isbn) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(JSON.stringify(books[isbn], null, 4));
    }, 2000);
  });
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  const booksByISBN = await getBooksByISBN(isbn);
  res.send(booksByISBN);
});

function getBooksByAuthor(author) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const booksByAuthor = {};
      for (const key in books){
        const book = books[key];
        if (book.author === author) {
          booksByAuthor[key] = book;
        }
      }
      resolve(JSON.stringify(booksByAuthor, null, 4));
    }, 2000);
  });
}
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  const booksByAuthor = await getBooksByAuthor(author);
  res.send(booksByAuthor);
});

function getBooksByTitle(title) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const booksByTitle = {};
      for (const key in books){
        const book = books[key];
        if (book.title === title) {
          booksByTitle[key] = book;
        }
      }
      resolve(JSON.stringify(booksByTitle, null, 4));
    }, 2000);
  });
}

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  const booksByTitle = await getBooksByTitle(title);
  res.send(booksByTitle);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;
