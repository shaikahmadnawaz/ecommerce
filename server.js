import express from "express";
import bodyParser from "body-parser";
import connectDB from "./db/connectDB.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

const app = express();
app.use(express.json());
app.use(cors());

// Use the product routes
app.use("/products", productRoutes);
// Use the user routes
app.use("/users", userRoutes);
// Use the cart routes
app.use("/cart", cartRoutes);

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
