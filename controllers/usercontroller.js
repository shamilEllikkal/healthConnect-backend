import asyncHanlder from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

//Auth controllers
export const registerUser = asyncHanlder(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }
  //hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  //create new user
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    profilePicture: req.file ? req.file.path : "",
  });
  res.status(201).json({
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    profilePicture: newUser.profilePicture,
    role: newUser.role,
  });
});

export const loginUser = asyncHanlder(async (req, res) => {
  const { email, password } = req.body;
  //check role

  //check if all fields are provided
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  
  //check if email is valid
  if (!email.includes("@")) {
    return res.status(400).json({ message: "Invalid email" });
  }
  const userData = await User.findOne({ email });

  if (!userData) {
    return res
      .status(400)
      .json({ message: "User not found signup first or invalid credentials" });
  }
  if (userData && (await bcrypt.compare(password, userData.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          name: userData.name,
          email: userData.email,
          id: userData.id,
          role: userData.role,
        },
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    return res.status(200).json({
      accessToken,
      user: {
        name: userData.name,
        email: userData.email,
        id: userData.id,
        role: userData.role,
        profile:userData.profilePicture
      },
    });
  } else {
    res.status(401);
    throw new Error("Email is not valid");
  }
  
});

export const getUserProfile = asyncHanlder(async (req, res) => {
  const userId = req.params.id;
  const userProfile = await User.findById(userId).select("-password");
  if (!userProfile) {
    return res.status(404);
    throw new Error("User not found");
  }
  res.status(200).json(userProfile);
});

export const updateUserProfile = asyncHanlder(async (req, res) => {
  const existingUser = await User.findOne({ _id: req.params.id });
  if (!existingUser) {
    res.status(400);
    throw new Error("there is no existing user");
  }

 const {phone} = req.body;


const updatedUser = await User.findByIdAndUpdate(req.params.id,req.body,{
    new:true,
});
    res.status(200).json(updatedUser)
});

export const getUsers = asyncHanlder(async(req,res)=>{
  const userList = await User.find({role:{$ne:"admin"}})
  if(!userList){
    res.status(400).json({msg:"there is no users"})
  }
  res.status(200).json(userList)
})
