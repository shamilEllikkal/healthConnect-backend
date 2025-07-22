import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const validateToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.toLowerCase().startsWith("bearer")) {
    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401);
      throw new Error("Token is missing");
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.user.id).select("-password"); // Exclude password if not needed

      if (!user) {
        res.status(401);
        throw new Error("User not found");
      }

      req.user = user;
      next();
    } catch (err) {
      console.error("JWT Error:", err.message);
      res.status(401);
      throw new Error("User not authorized");
    }
  } else {
    res.status(401);
    throw new Error("Authorization header is missing or malformed");
  }
});

export default validateToken;
