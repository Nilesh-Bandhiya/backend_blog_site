const User = require("../models/userModel");
const ResetToken = require("../models/resetPasswordModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  welcomeEmail,
  resetPasswordEmail,
  loginRequestEmail,
} = require("../services/emailService");

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

    const welcomeUrl = process.env.FRONT_HOST_URL;

    welcomeEmail(user.email, welcomeUrl, user.firstName);

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
      return res.status(404).json({ msg: "User Not Found" });
    }

    const isMatch = await bcrypt.compare(formData.password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    if (!user.active) {
      const welcomeUrl = process.env.FRONT_HOST_URL;
      loginRequestEmail("radheayar5050@gmail.com", welcomeUrl, user.firstName);
      return res
        .status(400)
        .json({ msg: "You will not Log In until admin give you access" });
    }

    const payload = {
      user: user._id,
    };

    const token = jwt.sign(payload, process.env.ACCESS_JWT_SECRET, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_JWT_SECRET, {
      expiresIn: "1d",
    });

    const { password, ...userData } = user._doc;

    await User.findByIdAndUpdate(userData._id, {
      refreshToken: refreshToken,
    });

    res.status(200).json({
      msg: "User Logged In Successfully",
      data: userData,
      token: token,
      refreshToken: refreshToken,
    });
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
      email: user.email,
    };

    let token = jwt.sign(payload, process.env.ACCESS_JWT_SECRET, {
      expiresIn: "5m",
    });

    token = new ResetToken({ token });
    const resetToken = await token.save();

    const resetLink = `${process.env.FRONT_HOST_URL}/reset-password/${resetToken._id}`;
    resetPasswordEmail(user.email, resetLink, user.firstName);
    res.status(200).json({
      msg: "Mail send successfully for forgot password",
      data: formData,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
};

const checkTokenExpiry = async (req, res) => {
  const tokenId = req.params?.tokenId;
  try {
    const resetToken = await ResetToken.findById(tokenId);
    if (!resetToken) {
      return res.status(404).json({ msg: "Reset-Token Not Found" });
    }

    const decoded = jwt.verify(resetToken.token, process.env.ACCESS_JWT_SECRET);

    if (!(decoded.exp > Date.now() / 1000)) {
      return res.status(410).json({ msg: "Reset-Token Expired" });
    }

    const userId = decoded.user;

    res.status(200).json({ msg: "User Authorized", data: userId });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { userId } = req.params;
  let formData = req.body;
  try {
    let user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ msg: "User not Found" });
    }

    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(formData.password, salt);
    await User.findByIdAndUpdate(
      user._id,
      { password: newPassword },
      {
        new: true,
      }
    );
    await ResetToken.findByIdAndDelete(formData?.tokenId);
    res.status(200).json({ msg: "Password Reset Successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
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

    res
      .status(200)
      .json({ msg: "Password Changed Successfully", data: userData });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
};

const handleRefreshToken = async (req, res) => {
  try {
    const refreshToken = req.body?.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ msg: "Refresh token is missing" });
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);
      console.log("decoded", decoded);
      const user = await User.findOne({ _id: decoded.user });

      if (!user) {
        return res.status(401).json({ msg: "User not authorized" });
      }

      const payload = {
        user: user._id,
      };

      const newAccessToken = jwt.sign(payload, process.env.ACCESS_JWT_SECRET, {
        expiresIn: "15m",
      });

      // Generate a new refresh token and store it in the database here if using token rotation.

      res
        .status(200)
        .json({ msg: "New token sent successfully", token: newAccessToken });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        // Handle expired token here
        return res.status(420).json({ msg: "Please Logout First and Login Again" });
      } else {
        // Handle other JWT verification errors
        console.error("JWT Verification Error:", error.message);
        return res.status(500).json({ msg: "Internal server error" });
      }
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  checkTokenExpiry,
  resetPassword,
  changePassword,
  handleRefreshToken,
};
