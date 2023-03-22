const User = require("../models/usersModel");
const Blog = require("../models/blogsModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const formData = req.body;

  try {
    let user = await User.findOne({ email: formData.email });
    if (user) {
      return res.status(400).json({ msg: "User Already Exsits" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(formData.password, salt);

    user = new User({
      ...formData,
      password: hashedPassword,
    });

    const registeredUser = await user.save();

    const { password, ...userData } = registeredUser._doc;

    res
      .status(201)
      .json({ msg: "User Registerd Successfully", data: userData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  const formData = req.body;

  try {
    const user = await User.findOne({ email: formData.email });
    if (!user) {
      return res.status(404).json({ msg: "User Not Found" });
    }

    const isMatch = await bcrypt.compare(formData.password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    if (!user.active) {
      return res
        .status(400)
        .json({ msg: "You will not Log In until admin give you access" });
    }

    const payload = {
      user: user._id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: 360000,
    });

    res.cookie("token", token, { httpOnly: true, expiresIn: 360000 });

    const { password, ...userData } = user._doc;

    res
      .status(200)
      .json({ msg: "User Logged In Successfully", data: userData });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ msg: "User Logged Out Successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ msg: "User not Found" });
    }

    const { password, ...userData } = user._doc;
    res.status(200).json({ msg: "User Found", data: userData });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const updateUser = async (req, res) => {
  const formData = req.body;
  try {
    let user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ msg: "User not Found" });
    }

    let exists = await User.findOne({ email: formData.email });
    if (exists && exists._id?.toString() !== user._id?.toString()) {
      return res.status(404).json({ msg: "Email Already Exists" });
    }

    const updetedUser = await User.findByIdAndUpdate(user._id, formData, {
      new: true,
    });

    const { password, ...userData } = updetedUser._doc;

    res.status(200).json({ msg: "User Updated Successfully", data: userData });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    let user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ msg: "User not Found" });
    }

    const blogs = await Blog.find({userId: req.user})
    if (blogs) {
      await Blog.deleteMany({userId: req.user});
    }

    await User.findByIdAndDelete(user._id);

    res.status(200).json({ msg: "User Deleted Successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const changePassword = async (req, res) => {
  const formData = req.body;
  try {
    let user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ msg: "User not Found" });
    }

    const isMatch = await bcrypt.compare(formData.password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(formData.newPassword, salt);

    const updetedUser = await User.findByIdAndUpdate(
      user._id,
      { password: newPassword },
      {
        new: true,
      }
    );

    const { password, ...userData } = updetedUser._doc;

    res.status(200).json({ msg: "Password Changed Successfully", data: userData });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const getAllUsers = async (req, res) => {
    try {
        let user = await User.findById(req.user);

        if (!user.role !== "admin") {
            return res
              .status(400)
              .json({ msg: "Only Admin has access the all Users" });
          }
        
        const users = await User.find({});
        res.status(200).json({msg: "Users fetch SuccessFully", data: users})

    } catch (error) {
        console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
    }
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  updateUser,
  deleteUser,
  changePassword,
  getAllUsers
};
