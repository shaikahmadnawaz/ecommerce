import Cart from "../models/Cart.js";

// Get user's cart
const getCart = async (req, res) => {
  const userId = req.user.id;
  try {
    const cart = await Cart.findOne({ user: userId }).populate(
      "products.product"
    );
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add product to cart
const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;
  try {
    let cart = await Cart.findOne({ user: userId });

    // If cart doesn't exist, create a new one
    if (!cart) {
      cart = await Cart.create({ user: userId, products: [] });
    }

    // Check if the product is already in the cart
    const existingProductIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingProductIndex !== -1) {
      // Product already exists in the cart, update the quantity
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      // Product doesn't exist in the cart, add it
      cart.products.push({ product: productId, quantity });
    }

    // Save the updated cart
    await cart.save();

    // Populate the product data in the cart
    await cart.populate("products.product").execPopulate();

    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Remove product from cart
const removeFromCart = async (req, res) => {
  const productId = req.params.productId;
  const userId = req.user.id;
  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Filter out the product from the cart
    cart.products = cart.products.filter(
      (item) => item.product.toString() !== productId
    );

    // Save the updated cart
    await cart.save();

    // Populate the product data in the cart
    await cart.populate("products.product").execPopulate();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export { getCart, addToCart, removeFromCart };
