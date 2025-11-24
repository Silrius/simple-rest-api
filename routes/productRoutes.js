const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");

// All product routes require login
router.use(protect);

router.get("/", productController.getProducts);
router.get("/:id", productController.getProduct);
router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct);
router.patch("/:id", productController.patchProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
