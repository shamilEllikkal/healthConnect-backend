import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.toLocaleLowerCase().startsWith("bearer")) {
    token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401);
      throw new Error("token is missing");
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.user;
      next();
    } catch {
      res.status(401);  
      throw new Error("user not autherized");
    }
  } else {
    res.status(401);
    throw new Error("authorization header is missing or malformed");
  }
});


export default validateToken;
