const express = require("express");
const fs = require("fs");
const router = express.Router();

const USERS_PATH = "./data/users.json";

// GET all users
router.get("/", (req, res) => {
  const users = JSON.parse(fs.readFileSync(USERS_PATH));
  res.json(users);
});

// POST a new user
router.post("/", (req, res) => {
  const users = JSON.parse(fs.readFileSync(USERS_PATH));

  const newUser = {
    id: users.length + 1,
    name: req.body.name
  };

  users.push(newUser);
  fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));

  res.status(201).json(newUser);
});

module.exports = router;
