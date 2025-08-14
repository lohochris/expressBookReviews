const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// -------------------- Task 6: Register a new user --------------------
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if user already exists
  let userExists = users.some((user) => user.username === username);
  if (userExists) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // Add user
  users.push({ username: username, password: password });
  return res.status(200).json({ message: "User registered successfully" });
});

// -------------------- Task 1 + Task 10: Get book list (async/await) --------------------
public_users.get('/', async (req, res) => {
  try {
    // Simulating async fetch with axios to our own server
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching book list", error: err.message });
  }
});

// -------------------- Task 2 + Task 11: Get book by ISBN (async/await) --------------------
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(404).json({ message: "Book not found", error: err.message });
  }
});

// -------------------- Task 3 + Task 12: Get book by author (async/await) --------------------
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(404).json({ message: "No books found for this author", error: err.message });
  }
});

// -------------------- Task 4 + Task 13: Get book by title (async/await) --------------------
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(404).json({ message: "No books found with this title", error: err.message });
  }
});

// -------------------- Task 5: Get book review --------------------
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).send(JSON.stringify(book.reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
