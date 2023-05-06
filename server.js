import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

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

const port = 5000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
