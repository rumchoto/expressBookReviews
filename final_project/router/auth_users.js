const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let usersWithSameName = users.filter((user)=>{
    return user.username === username
  });
  if(usersWithSameName.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validUsers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validUsers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60});

    req.session.authorization = {
      accessToken,username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization.username;
  const isbn = req.params.isbn;
  const reviewText = req.body.review;
  if (!reviewText) {
    return res.status(404).json({message: "Missing review text"});
  }

  const reviews = books[isbn].reviews;
  let userReview = reviews[username];
  if (userReview) {
    reviews[username] = reviewText;
    res.status(200).send("Review successfully updated.");
  } else {
    reviews[username] =  reviewText;
    res.status(200).send("Review successfully created.");
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization.username;
  const isbn = req.params.isbn;

  const reviews = books[isbn].reviews;
  let userReview = reviews[username];
  if (userReview) {
    delete reviews[username];
    res.status(200).send("Review successfully deleted.");
  } else {
    res.status(404).send("No reviews to delete.");
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
