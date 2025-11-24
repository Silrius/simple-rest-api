const jwt = require("jsonwebtoken");
const { findUserById } = require("../models/userModel");

function throwError(message, status = 401) {
  const err = new Error(message);
  err.status = status;
  return err;
}

exports.protect = async (req, res, next) => {
  try {
    let token;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return next(throwError("Not authorized, no token", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await findUserById(decoded.userId);
    if (!user) {
      return next(throwError("User no longer exists", 401));
    }

    // attach user to request
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email
    };

    next();
  } catch (err) {
    // token issues
    err.status = 401;
    next(err);
  }
};
