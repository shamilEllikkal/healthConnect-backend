import jwt from "jsonwebtoken"
import asyncHandler from "express-async-handler"


export const verifyToken = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  console.log(decoded)
  next();
});

export const isAdmin = asyncHandler(async(req, res, next) => {
  console.log(req.user.role)
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next();
});

