const express = require("express");
const app = express();

app.use(express.json()); // allows JSON in requests

// Import user routes
const userRoutes = require("./routes/userRoutes");
app.use("/users", userRoutes);

// Import product routes
const productRoutes = require("./routes/productRoutes");
app.use("/products", productRoutes);

// Basic homepage endpoint
app.get("/", (req, res) => {
  res.send("REST API is running...");
});

// Start server
app.listen(5000, () => {
  console.log("Server listening on http://localhost:5000");
});
