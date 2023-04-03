const User = require("../models/userModel");
const Blog = require("../models/blogModel");
const ResetToken = require("../models/resetPasswordModel")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require('fs');

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
      .json({ msg: "User Registered Successfully", data: userData });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
};

const loginUser = async (req, res) => {
  const formData = req.body;

  try {
    const user = await User.findOne({ email: formData.email });
    if (!user) {
      return res.status(404).json({ msg: "User Not Found 12" });
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

    const { password, ...userData } = user._doc;

    res
      .status(200)
      .json({ msg: "User Logged In Successfully", data: userData, token: token });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
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
        fs.unlink(`./images/${blog.image}`, (err) => {
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

const forgotPassword = async (req, res) => {
  const formData = req.body;
  try {
    let user = await User.findOne({ email: formData?.email });

    if (!user) {
      return res.status(404).json({ msg: "User not Found" });
    }

    const payload = {
      user: user._id,
      email: user.email
    };

    const secret = process.env.JWT_SECRET + user.password

    let token = jwt.sign(payload, secret, {
      expiresIn: "5m",
    });

    token = new ResetToken({token})
    const resetToken = await token.save()

    const forgotLink = `${process.env.HOST_URL}3000/reset-password/${user._id}/${resetToken._id}`
    console.log(forgotLink);
    res.status(200).json({ msg: "Mail send successfully for forgot password", data: formData });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }

}

const resetPassword = async (req, res) => {
  const { id, token } = req.params
  try {
    let user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({ msg: "User not Found" });
    }
    const secret = process.env.JWT_SECRET + user.password

    const verify = jwt.verify(token, secret)
    console.log(Date.now() / 1000);
    console.log(verify.exp);
    console.log(verify.exp > new Date().toUTCString());
    res.status(200).json({ msg: "Verified" })

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }


  console.log(id, token);
}

const verifyForPassword = async (req, res) => {

}

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
  registerUser,
  loginUser,
  getMe,
  updateUser,
  changeRoleAndStatus,
  deleteUser,
  forgotPassword,
  verifyForPassword,
  resetPassword,
  changePassword,
  getAllUsers
};
