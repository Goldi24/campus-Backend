// const User = require("../models/User");

// // Create User
// exports.createUser = async (req, res) => {
//   try {
//     const user = await User.create(req.body);
//     res.status(201).json({ success: true, data: user });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };

// // Get Users
// exports.getUsers = async (req, res) => {
//   const users = await User.find();
//   res.json(users);
// };

// // Update User
// exports.updateUser = async (req, res) => {
//   const user = await User.findByIdAndUpdate(req.params.id, req.body, {
//     new: true
//   });
//   res.json(user);
// };

// // Delete User
// exports.deleteUser = async (req, res) => {
//   await User.findByIdAndDelete(req.params.id);
//   res.json({ message: "User deleted" });
// };




const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Create User (Register)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

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
      message: "User Registered Successfully",
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(
      `Login Attempt: ${email}`
    );

    const user = await User.findOne({
      email,
    });

    if (!user) {
      console.log(
        `Failed Login: ${email}`
      );

      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
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
        expiresIn: "1d",
      }
    );

    res.json({
      success: true,
      message: "Login Successful",
      token,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get Users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.json(users);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update User
exports.updateUser = async (
  req,
  res
) => {
  try {
    const user =
      await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    res.json(user);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete User
exports.deleteUser = async (
  req,
  res
) => {
  try {
    await User.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true,
      message: "User Deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};