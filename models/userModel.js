const { readJSON, writeJSON } = require("../utils/fileUtils");
const USERS_PATH = "./data/users.json";

async function getAllUsers() {
  return await readJSON(USERS_PATH);
}

async function saveUsers(users) {
  await writeJSON(USERS_PATH, users);
}

module.exports = { getAllUsers, saveUsers };
