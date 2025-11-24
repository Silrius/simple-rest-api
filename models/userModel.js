const { readJSON, writeJSON } = require("../utils/fileUtils");
const USERS_PATH = "./data/users.json";

async function getAllUsers() {
  return await readJSON(USERS_PATH);
}

async function saveUsers(users) {
  await writeJSON(USERS_PATH, users);
}

async function findUserByEmail(email) {
  const users = await getAllUsers();
  return users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase());
}

async function findUserById(id) {
  const users = await getAllUsers();
  return users.find(u => u.id === id);
}

module.exports = {
  getAllUsers,
  saveUsers,
  findUserByEmail,
  findUserById
};
