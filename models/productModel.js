const { readJSON, writeJSON } = require("../utils/fileUtils");
const PRODUCTS_PATH = "./data/products.json";

async function getAllProducts() {
  return await readJSON(PRODUCTS_PATH);
}

async function saveProducts(products) {
  await writeJSON(PRODUCTS_PATH, products);
}

module.exports = { getAllProducts, saveProducts };
