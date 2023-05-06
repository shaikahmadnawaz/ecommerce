import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to protect routes
const protect = async (req, res, next) => {
  try {
    // Check if the authorization header exists
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Extract the token from the header
    const token = authorizationHeader.split(" ")[1];

    // Verify the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Get the user associated with the token
    const user = await User.findById(decoded.userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach the user to the request object
    req.user = user;

    // Move to the next middleware
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export { protect };
