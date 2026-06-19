const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();


// Register User
router.post("/", async (req, res) => {
  try {
    const { name, email, password } =
      req.body;

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    console.log(
      `New User Registered: ${email}`
    );

    res.status(201).json({
      success: true,
      message: "User Created",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// Login User
router.post("/login", async (req, res) => {
  try {
    const { email, password } =
      req.body;

    console.log(
      `Login Attempt: ${email}`
    );

    const user =
      await User.findOne({ email });

    if (!user) {
      console.log(
        `Failed Login: ${email}`
      );

      return res.status(400).json({
        success: false,
        message: "Invalid Email",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      console.log(
        `Failed Login: ${email}`
      );

      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({
      success: true,
      message: "Login Successful",
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// Get Users
router.get("/", auth, async (req, res) => {
  try {
    const users = await User.find();

    res.json(users);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// Update User
router.put("/:id", async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      message: "User Updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// Delete User
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true,
      message: "User Deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;