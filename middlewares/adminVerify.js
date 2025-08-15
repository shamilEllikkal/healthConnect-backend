import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

export const verifyToken = asyncHandler(async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Fix: Use decoded.user, not just decoded
    console.log("User in token:", req.user); // Debug log
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
});

export const isAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  console.log("User role:", req.user.role); // Debug log
  
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  
  next();
});