import express from "express";
import bodyParser from "body-parser";
import connectDB from "./db/connectDB.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

let products = [
  { id: 1, name: "Product 1", price: 10.99 },
  { id: 2, name: "Product 2", price: 19.99 },
];

// get all products
app.get("/products", (req, res) => {
  res.json(products);
});

// get a single product
app.get("/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find((product) => product.id === productId);
  if (!product) {
    res.status(404).json({ message: "Product not found" });
  } else {
    res.json(product);
  }
});

// create a new product
app.post("/products", (req, res) => {
  const { id, name, price } = req.body;
  const newProduct = { id, name, price };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// update a product
app.patch("/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const { name, price } = req.body;
  const product = products.find((product) => product.id === productId);
  if (!product) {
    res.status(404).json({ message: "Product not found" });
  } else {
    product.name = name || product.name;
    product.price = price || product.price;
    res.json(product);
  }
});

// delete a product
app.delete("/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const productIndex = products.findIndex(
    (product) => product.id === productId
  );
  if (productIndex === -1) {
    res.status(404).json({ message: "Product not found" });
  } else {
    const deletedProduct = products.splice(productIndex, 1)[0];
    res.json(deletedProduct);
  }
});

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
