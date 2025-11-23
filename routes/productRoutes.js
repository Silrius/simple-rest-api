const express = require("express");
const fs = require("fs");
const router = express.Router();

const PRODUCTS_PATH = "./data/products.json";

// GET all products
router.get("/", (req, res) => {
  const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH));
  res.json(products);
});

// GET a single product by ID
router.get("/:id", (req, res) => {
  const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH));
  const product = products.find(p => p.id === parseInt(req.params.id));

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});

// POST a new product
router.post("/", (req, res) => {
  const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH));

  const newProduct = {
    id: products.length + 1,
    name: req.body.name,
    price: req.body.price
  };

  products.push(newProduct);
  fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(products, null, 2));

  res.status(201).json(newProduct);
});

// DELETE a product
router.delete("/:id", (req, res) => {
  const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH));
  const id = parseInt(req.params.id);

  const newProducts = products.filter(p => p.id !== id);

  if (newProducts.length === products.length) {
    return res.status(404).json({ message: "Product not found" });
  }

  fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(newProducts, null, 2));

  res.json({ message: "Product deleted" });
});

module.exports = router;
