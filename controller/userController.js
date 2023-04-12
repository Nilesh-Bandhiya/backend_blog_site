const User = require("../models/userModel");
const Blog = require("../models/blogModel");
const fs = require('fs');

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
    res.status(500).json({ msg: error.message });
  }
};

const updateUser = async (req, res) => {
  const { role, active, ...formData } = req.body;
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

    res.status(200).json({ msg: "Profile Updated Successfully", data: userData });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
};

const changeRoleAndStatus = async (req, res) => {
  const { _id, role, active } = req.body;
  try {
    let user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ msg: "User not Found" });
    }

    const updetedUser = await User.findByIdAndUpdate(user._id, { role, active }, {
      new: true,
    });

    const { password, ...userData } = updetedUser._doc;

    res.status(200).json({ msg: "User Updated Successfully", data: userData });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    let user = await User.findById(req.params?.userId);

    if (!user) {
      return res.status(404).json({ msg: "User not Found" });
    }

    const blogs = await Blog.find({ userId: user._id })
    if (blogs) {
      await Blog.deleteMany({ userId: user._id });
      blogs.forEach((blog) => {
        fs.unlink(`images/${blog.image}`, (err) => {
          if (err) console.log(err);
        });
      })
    }

    await User.findByIdAndDelete(user._id);

    res.status(200).json({ msg: "User Deleted Successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
};



const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ msg: "Users fetch SuccessFully", data: users })

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
}

module.exports = {
  getMe,
  updateUser,
  changeRoleAndStatus,
  deleteUser,
  getAllUsers
};
