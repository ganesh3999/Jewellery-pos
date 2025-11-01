const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Product = require("./models/Product");

const app = express();
const PORT = process.env.PORT || 4000; // ✅ Use dynamic port for deployment

// 🧠 MongoDB Connection
// For Render deployment, replace with process.env.MONGO_URI
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/jewelleryPOS", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use(cors());
app.use(express.json());

// 🔹 Test Route
app.get("/", (req, res) => res.send("💎 Jewellery POS Backend Running with MongoDB!"));

// 🔹 Get All Products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Server error while fetching products" });
  }
});

// 🔹 Add a New Product
app.post("/products", async (req, res) => {
  try {
    const { name, weight, purity, price } = req.body;
    if (!name || !weight || !purity || !price) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newProduct = new Product({ name, weight, purity, price });
    await newProduct.save();

    res.status(201).json({ message: "✅ Product added successfully", product: newProduct });
  } catch (err) {
    res.status(500).json({ error: "Server error while adding product" });
  }
});

// 🔹 Update Product
app.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, weight, purity, price } = req.body;

    if (!name || !weight || !purity || !price) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, weight, purity, price },
      { new: true }
    );

    if (!updatedProduct) return res.status(404).json({ error: "Product not found" });

    res.json({ message: "✏️ Product updated successfully", product: updatedProduct });
  } catch (err) {
    res.status(500).json({ error: "Server error while updating product" });
  }
});

// 🔹 Delete Product
app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) return res.status(404).json({ error: "Product not found" });

    res.json({ message: "🗑️ Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error while deleting product" });
  }
});

// 🔹 Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
