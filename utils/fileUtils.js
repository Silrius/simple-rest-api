const fs = require("fs").promises;

// Read JSON file
async function readJSON(path) {
  const data = await fs.readFile(path, "utf8");
  return JSON.parse(data);
}

// Write JSON file
async function writeJSON(path, data) {
  await fs.writeFile(path, JSON.stringify(data, null, 2));
}

module.exports = { readJSON, writeJSON };
