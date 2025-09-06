const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  sendResetPassword,
  sendVerificationLink,
} = require("../utils/emailSender");
require("dotenv").config();

// Helper functions
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.user_id, role: user.user_role, email: user.user_email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.user_id, role: user.user_role, email: user.user_email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};

// ✅ Create/Register User
exports.createUser = async (req, res) => {
  try {
    const {
      user_first_name,
      user_last_name,
      user_address,
      user_phone_number,
      user_email,
      user_password,
      user_role,
      user_interested,
    } = req.body;

    // check if email already exists
    const existingUser = await User.findOne({ user_email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(user_password, 12);

    // handle profile picture if uploaded
    const user_profile_picture = req.file
      ? `/uploads/${req.file.filename}`
      : "default-profile.png"; // fallback

    // create new user
    const newUser = new User({
      user_first_name,
      user_last_name,
      user_address,
      user_phone_number,
      user_email,
      user_password: hashedPassword,
      user_profile_picture,
      user_role: user_role || "volunteer",
      user_interested: user_interested || [],
    });

    await newUser.save();

    // Send verification email
    const token = jwt.sign(
      { email: newUser.user_email },
      process.env.EMAIL_VERIFY_SECRET,
      { expiresIn: "1d" }
    );

    await sendVerificationLink(newUser.user_email, token);

    res.status(201).json({ message: "User created successfully, check your email for verification link" });
  } catch (error) {
    console.error("Create User Error:", error);
    res.status(500).json({ message: "Error creating user" });
  }
};

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

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    await sendResetPassword(email, token);

    res.status(200).json({ message: "Reset link sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error sending reset link", error });
  }
};


// ✅ Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

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
console.log(email, password);
    // Check if user exists
    const user = await User.findOne({ user_email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.user_verified) {
      return res.status(401).json({
        message:
          "Please verify your account before login. Check inbox or Spam list.",
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.user_password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.user_password;
    delete userWithoutPassword._id;
    delete userWithoutPassword.__v;
    delete userWithoutPassword.user_interested;


    // Send refreshToken as HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Refresh Token
exports.refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findOne({ user_id: decoded.id });
    if (!user) return res.status(404).json({ message: "User not found" });

    const newAccessToken = generateAccessToken(user);

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Refresh error:", error);
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};

// ✅ Logout
exports.logout = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ message: "Logged out successfully" });
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

    res.status(200).json({user});
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Verify Email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    const user = await User.findOne({ user_email: decoded.email });
    if (!user) return res.status(400).json({ message: "Invalid Token" });

    user.user_verified = true;
    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    res.status(400).json({ message: "Invalid or Expired token" });
    console.log(error);
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
