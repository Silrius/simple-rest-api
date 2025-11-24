const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  getAllUsers,
  saveUsers,
  findUserByEmail
} = require("../models/userModel");

function throwError(message, status = 400) {
  const err = new Error(message);
  err.status = status;
  return err;
}

function generateToken(userId) {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
  );
}

// POST /auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // basic validation
    if (!name || !name.trim()) {
      return next(throwError("Name is required", 400));
    }
    if (!email || !email.trim()) {
      return next(throwError("Email is required", 400));
    }
    if (!password || password.length < 6) {
      return next(throwError("Password must be at least 6 characters", 400));
    }

    // check existing user
    const existing = await findUserByEmail(email);
    if (existing) {
      return next(throwError("Email already in use", 400));
    }

    const users = await getAllUsers();

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = {
      id: users.length + 1,
      name,
      email,
      passwordHash
    };

    users.push(newUser);
    await saveUsers(users);

    const token = generateToken(newUser.id);

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (err) {
    next(err);
  }
};

// POST /auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(throwError("Email and password are required", 400));
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return next(throwError("Invalid email or password", 401));
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return next(throwError("Invalid email or password", 401));
    }

    const token = generateToken(user.id);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    next(err);
  }
};
