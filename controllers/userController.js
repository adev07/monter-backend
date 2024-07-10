// Import Model
import User from "../models/User.js";
import { sendOtp, verifyOtp } from "../utils/otp.js";
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Making Promise
import bigPromise from "../middlewares/bigPromise.js";

export const addUser = bigPromise(async (req, res) => {
  const { email, userName, password, name } = req.body;

  if (!email || !userName || !password || !name) {
    return res
      .status(400)
      .json({ error: "Please provide all required fields" });
  }

  const userExists = await User.findOne({ $or: [{ email }, { userName }] });
  if (userExists) {
    return res.status(400).json({ error: "Email or Username already exists" });
  }

  const newUser = new User({ email, userName, password, name });
  await newUser.save();
  await sendOtp(email);

  res.status(201).json({
    message: "User registered successfully. Please check your email for OTP.",
  });
});

export const VerifyOtp = bigPromise(async (req, res) => {
  const { email, otp } = req.body;

  const isValid = await verifyOtp(email, otp);
  if (!isValid) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  await User.updateOne({ email }, { isVerified: true });

  res.status(200).json({ message: "OTP verified successfully" });
});

export const loginUser = bigPromise(async (req, res) => {
  const { emailOrUsername, password } = req.body;

  const user = await User.findOne({
    $or: [{ email: emailOrUsername }, { userName: emailOrUsername }],
  }).select("+password");

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user._id }, "secretKey", { expiresIn: "1h" });

  res.status(200).json({ token });
});

export const completeProfile = bigPromise(async (req, res) => {
  const { email, location, age, work, dob, description } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  const token = jwt.sign({ id: user._id }, "secretKey", { expiresIn: "1h" });

  user.location = location;
  user.age = age;
  user.work = work;
  user.dob = dob;
  user.description = description;
  await user.save();

  res.status(200).json({ message: "Profile completed successfully" , token});
});

export const dashboard = bigPromise(async (req, res) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  // console.log("reqgeader", req.header);
  // console.log("token", token);
  const decoded = jwt.verify(token, "secretKey");
  const user = await User.findById(decoded.id);

  res.status(200).json(user);
});

export const updateProfile = bigPromise(async (req, res) => {
  const token = req.header("Authorization").replace("Bearer ", "");

  const decoded = jwt.verify(token, "secretKey");
  const user = await User.findById(decoded.id);

  const { location, age, work, dob, description } = req.body;
  user.location = location;
  user.age = age;
  user.work = work;
  user.dob = dob;
  user.description = description;
  await user.save();

  res.status(200).json({ message: "Profile updated successfully" });
});

