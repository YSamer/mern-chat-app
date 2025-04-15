import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // validations
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }
    // email validation
    // if (!validator.isEmail(email)) {
    //   return res.status(400).json({ message: "Invalid email" });
    // }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists", success: false });
    }
    // Password validation
    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
        success: false,
      });
    }
    // Password hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      generateToken(res, newUser._id);
      res.status(201).json({
        user: newUser,
        message: "User created successfully",
        success: true,
      });
    } else {
      return res
        .status(400)
        .json({ message: "Invalid user data", success: false });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: error.message, success: false });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // validations
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }
    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid email or password", success: false });
    }
    // check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ message: "Invalid email or password", success: false });
    }
    const token = generateToken(res, user._id);
    res.status(200).json({
      user: user,
      token: token,
      message: "Logged in successfully",
      success: true,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: error.message, success: false });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully", success: true });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: error.message, success: false });
  }
};

export const updateUser = async (req, res) => {
  const { avatar } = req.body;
  try {
    const userId = req.user._id;
    let uploadResponse;
    if (avatar) {
      uploadResponse = await cloudinary.uploader.upload(avatar, {
        folder: "avatars",
        new: true,
      });
    }
    const user = await User.findByIdAndUpdate(userId, {
      name,
      email,
      password,
      avatar: uploadResponse?.secure_url || "",
    });
    res.status(200).json({
      user: user,
      message: "User updated successfully",
      success: true,
    });
  } catch (error) {
    console.log("Error in updateUser controller", error.message);
    res.status(500).json({ message: error.message, success: false });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found", success: false });
    }
    res.status(200).json({ user: user, success: true });
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: error.message, success: false });
  }
};
