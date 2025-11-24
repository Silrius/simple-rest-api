const express = require("express");
const app = express();
require("dotenv").config();

app.use(express.json());
app.use(require("./middleware/logger"));

app.use("/users", require("./routes/userRoutes"));
app.use("/products", require("./routes/productRoutes"));

app.get("/", (req, res) => res.send("API is running"));

app.use(require("./middleware/errorHandler"));

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});

