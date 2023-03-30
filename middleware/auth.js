const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authorizeUser = async (req, res, next) => {

  const token = req.header('Authorization')?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ msg: "User Not Authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;

    next();
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
};

const authorizeAdmin = async (req, res, next) => {

  const token = req.header('Authorization')?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ msg: "User Not Authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.user);
    if (user.role !== "admin") {
      return res
        .status(400)  
        .json({ msg: "Authorize Yourself as a Admin" });
    }
    req.user = decoded.user;
    next();
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
};

module.exports = { authorizeAdmin, authorizeUser };
