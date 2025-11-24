const { getAllUsers, saveUsers } = require("../models/userModel");

// validation
function validateUser(data) {
  const errors = [];
  if (!data.name || data.name.trim() === "") errors.push("Name is required");
  return errors;
}

// throw helper
function throwError(message, status = 400) {
  const err = new Error(message);
  err.status = status;
  return err;
}

// GET all
exports.getUsers = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// GET one
exports.getUser = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    const id = parseInt(req.params.id);

    const user = users.find(u => u.id === id);
    if (!user) return next(throwError("User not found", 404));

    res.json(user);
  } catch (err) {
    next(err);
  }
};

// POST
exports.createUser = async (req, res, next) => {
  try {
    const users = await getAllUsers();

    const errors = validateUser(req.body);
    if (errors.length) return next(throwError(errors.join(", "), 400));

    const newUser = {
      id: users.length + 1,
      name: req.body.name
    };

    users.push(newUser);
    await saveUsers(users);

    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
};

// PUT
exports.updateUser = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    const id = parseInt(req.params.id);

    const index = users.findIndex(u => u.id === id);
    if (index === -1) return next(throwError("User not found", 404));

    const errors = validateUser(req.body);
    if (errors.length) return next(throwError(errors.join(", "), 400));

    const updated = { id, name: req.body.name };

    users[index] = updated;
    await saveUsers(users);

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// PATCH
exports.patchUser = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    const id = parseInt(req.params.id);

    const user = users.find(u => u.id === id);
    if (!user) return next(throwError("User not found", 404));

    if (req.body.name !== undefined) {
      const errors = validateUser({ name: req.body.name });
      if (errors.length) return next(throwError(errors.join(", "), 400));
      user.name = req.body.name;
    }

    await saveUsers(users);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// DELETE
exports.deleteUser = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    const id = parseInt(req.params.id);

    const newUsers = users.filter(u => u.id !== id);
    if (newUsers.length === users.length)
      return next(throwError("User not found", 404));

    await saveUsers(newUsers);
    res.json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
};
