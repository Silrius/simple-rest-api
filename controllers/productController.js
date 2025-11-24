const { getAllProducts, saveProducts } = require("../models/productModel");

// Validation helper
function validateProduct(data) {
  const errors = [];

  if (!data.name || data.name.trim() === "") {
    errors.push("Name is required");
  }

  if (data.price === undefined || isNaN(data.price)) {
    errors.push("Price must be a number");
  }

  return errors;
}

// Error helper
function throwError(message, status = 400) {
  const err = new Error(message);
  err.status = status;
  return err;
}

// GET all products
exports.getProducts = async (req, res, next) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (err) {
    next(err);
  }
};

// GET one product
exports.getProduct = async (req, res, next) => {
  try {
    const products = await getAllProducts();
    const id = parseInt(req.params.id);

    const product = products.find(p => p.id === id);
    if (!product) return next(throwError("Product not found", 404));

    res.json(product);
  } catch (err) {
    next(err);
  }
};

// POST new product
exports.createProduct = async (req, res, next) => {
  try {
    const products = await getAllProducts();

    const errors = validateProduct(req.body);
    if (errors.length) return next(throwError(errors.join(", "), 400));

    const newProduct = {
      id: products.length + 1,
      name: req.body.name,
      price: req.body.price
    };

    products.push(newProduct);
    await saveProducts(products);

    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
};

// PUT (full replace)
exports.updateProduct = async (req, res, next) => {
  try {
    const products = await getAllProducts();
    const id = parseInt(req.params.id);

    const index = products.findIndex(p => p.id === id);
    if (index === -1) return next(throwError("Product not found", 404));

    const errors = validateProduct(req.body);
    if (errors.length) return next(throwError(errors.join(", "), 400));

    const updated = {
      id,
      name: req.body.name,
      price: req.body.price
    };

    products[index] = updated;
    await saveProducts(products);

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// PATCH (partial update)
exports.patchProduct = async (req, res, next) => {
  try {
    const products = await getAllProducts();
    const id = parseInt(req.params.id);

    const product = products.find(p => p.id === id);
    if (!product) return next(throwError("Product not found", 404));

    // name update
    if (req.body.name !== undefined) {
      if (!req.body.name || req.body.name.trim() === "") {
        return next(throwError("Name is required", 400));
      }
      product.name = req.body.name;
    }

    // price update
    if (req.body.price !== undefined) {
      if (isNaN(req.body.price)) {
        return next(throwError("Price must be a number", 400));
      }
      product.price = req.body.price;
    }

    await saveProducts(products);
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// DELETE product
exports.deleteProduct = async (req, res, next) => {
  try {
    const products = await getAllProducts();
    const id = parseInt(req.params.id);

    const newProducts = products.filter(p => p.id !== id);
    if (newProducts.length === products.length) {
      return next(throwError("Product not found", 404));
    }

    await saveProducts(newProducts);
    res.json({ message: "Product deleted" });
  } catch (err) {
    next(err);
  }
};
