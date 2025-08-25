const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendResetPassword } = require("../utils/mailer");
require("dotenv").config();


// ✅ Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-user_password");
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};


// ✅ Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const id = req.query.id;
    const user = await User.findOne({ user_id: id }).select("-user_password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};


// ✅ Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ user_email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: "1h" });

    await sendResetPassword(email, token);

    res.status(200).json({ message: "Reset link sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending reset link", error });
  }
};


// ✅ Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findOne({ user_email: decoded.email });
    if (!user) return res.status(400).json({ message: "Invalid Token" });

    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 12);
    user.user_password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successfully!" });
  } catch (error) {
    res.status(500).json({ message: `Something went wrong: ${error}` });
  }
};


// ✅ Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ user_email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.user_verified) {
      return res
        .status(401)
        .json({
          message:
            "Please verify your account before login. Check inbox or Spam list for further details.",
        });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.user_password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user.user_id, role: user.user_role },
      process.env.SECRET_KEY,
      { expiresIn: "30m" }
    );

    // Send response with token
    res.status(200).json({
      message: "Login successful",
      token,
      role: user.user_role,
      id: user.user_id,
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ Authentication (check user from token)
exports.authentication = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user data found" });
    }

    const user = await User.findOne({ user_id: req.user.id }).select("-user_password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// ✅ Verify Email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findOne({ user_email: decoded.email });
    if (!user) return res.status(400).json({ message: "Invalid Token" });

    user.user_verified = true;
    await user.save();

    res.json({ message: "Email verified successfully!" });
  } catch (error) {
    res.status(400).json({ message: "Invalid or Expired token" });
  }
};


// ✅ Update User
exports.updateUser = async (req, res) => {
  try {
    const {
      user_first_name,
      user_last_name,
      user_email,
      user_address,
      user_phone_number,
      userId,
    } = req.body;

    const existingUser = await User.findOne({ user_id: userId });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // If new file uploaded, replace profile picture; else keep old one
    const user_profile_picture = req.file
      ? `/uploads/${req.file.filename}`
      : existingUser.user_profile_picture;

    const updateData = {
      user_first_name,
      user_last_name,
      user_email,
      user_address,
      user_phone_number,
      user_profile_picture,
    };

    const user = await User.findOneAndUpdate({ user_id: userId }, updateData, {
      new: true,
    }).select("-user_password");

    if (!user) return res.status(404).json("User not found");

    res.json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json(error);
  }
};


// ✅ Delete User
exports.deleteUser = async (req, res) => {
  try {
    const user_id = req.query.id;
    const user = await User.findOneAndDelete({ user_id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};
