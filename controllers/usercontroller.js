import asyncHanlder from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { generateOtp } from "../config/generateOtp.js";
import sendEmail from "../config/sendEmail.js";

const otpStore = new Map(); // Using a simple Map for OTP storage, consider using Redis or a database for production

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
      { expiresIn: "10m" }
    );
    const refreshToken = jwt.sign(
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
      refreshToken,
      user: {
        name: userData.name,
        email: userData.email,
        id: userData.id,
        role: userData.role,
        profile: userData.profilePicture,
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
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json(userProfile);
});

export const googleUser = asyncHanlder(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser && (await bcrypt.compare(password, existingUser.password))) {

    const accessToken = jwt.sign(
      {
        user: {
          name: existingUser.name,
          email: existingUser.email,
          id: existingUser._id,
          role: existingUser.role,
        },
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    return res.status(200).json({
      accessToken,
      user: {
        name: existingUser.name,
        email: existingUser.email,
        id: existingUser.id,
        role: existingUser.role,
        profile: existingUser.profilePicture,
      },
    });
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);

    //create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      profilePicture: req.file ? req.file.path : "",
    });

    if (newUser && (await bcrypt.compare(password, newUser.password))) {
      const accessToken = jwt.sign(
        {
          user: {
            name: newUser.name,
            email: newUser.email,
            id: newUser._id,
            role: newUser.role,
          },
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      const refreshToken = jwt.sign(
        {
          user: {
            name: newUser.name,
            email: newUser.email,
            id: newUser.id,
            role: newUser.role,
          },
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      return res.status(200).json({
        accessToken,
        refreshToken,
        user: {
          name: newUser.name,
          email: newUser.email,
          id: newUser._id,
          role: newUser.role,
          profile: newUser.profilePicture,
        },
      });
    }
  }
});

export const updateUserProfile = asyncHanlder(async (req, res) => {
  const existingUser = await User.findOne({ _id: req.params.id });
  if (!existingUser) {
    res.status(400);
    throw new Error("there is no existing user");
  }

  const { phone } = req.body;

  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json(updatedUser);
});

export const getUsers = asyncHanlder(async (req, res) => {
  const userList = await User.find({ role: { $ne: "admin" } });
  if (!userList) {
    res.status(400).json({ msg: "there is no users" });
  }
  res.status(200).json(userList);
});

export const refreshAccessToken = asyncHanlder((req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.status(401).json({ message: "Missing token" });

  jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid refresh token" });

    const newAccessToken = jwt.sign(
      { user: { id: decoded.id } },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    return res.json({ accessToken: newAccessToken });
  });
});

export const forgotPassword = asyncHanlder(async (req, res) => {
  const { email } = req.body;

  const findUser = await User.findOne({ email });

  if (!findUser) {
    res.status(400).json({ msg: "User Not Found, Sign up first" });
  }
  const otp = generateOtp();

  otpStore.set(email, otp, "EX", 5 * 60);

  setTimeout(() => otpStore.delete(email), 5 * 60 * 1000);

  await sendEmail({
    to: email,
    subject: "Your OTP Code from healthConnect",
    text: `Hello,

You requested to reset your password for HealthConnect. Please use the following OTP code to proceed:

${otp}

This code is valid for 5 minutes. Do not share it with anyone.

If you did not request this, please ignore this message.

Regards,  
HealthConnect Support Team
`,
    html: `<h1>Your OTP Code</h1>`,
  });

  res.status(200).json({ message: "OTP sent to email" });
});

export const verifyOtp = asyncHanlder(async (req, res) => {
  const { email, otp } = req.body;

  if (!otp || !email) {
    return res.status(400).json({ message: "OTP is required" });
  }

  const storedOtp = otpStore.get(email);
  console.log(storedOtp);

  if (!storedOtp) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  if (storedOtp !== otp) {
    return res.status(400).json({ message: "Incorrect OTP" });
  }

  otpStore.delete(email);

  res.status(200).json({ message: "OTP verified successfully" });
});

export const resetPass = asyncHanlder(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email });
  if(!user) {
    return res.status(404).json({ message: "User not found" });
  } 

  const hashedPassword = await bcrypt.hash(password, 10);
  
  const newUser = await User.findByIdAndUpdate(user._id, { password: hashedPassword }, { new: true });

  res.status(200).json({
    message: "Password reset successfully",
    user: newUser})

});
