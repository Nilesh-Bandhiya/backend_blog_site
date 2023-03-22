const User = require("../models/userModel");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const registerUser = async (req, res) => {
    const formData = req.body

    try {
        let user = await User.findOne({ email: formData.email })
        if (user) {
            return res.status(400).json({ msg: "User Already Exsits" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(formData.password, salt)

        user = new User({
            ...formData,
            password: hashedPassword,
        })

        const registeredUser = await user.save()

        const { password, ...userData } = registeredUser._doc;

        res.status(201).json({ msg: "User Registerd Successfully", data: userData })

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Internal Server Error" })
    }
}


const loginUser = async (req, res) => {
    const formData = req.body;

    try {
        const user = await User.findOne({ email: formData.email })
        if (!user) {
            return res.status(400).json({ msg: "User Not Found" })
        }

        const isMatch = await bcrypt.compare(formData.password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid Credentials" })
        }

        if (!user.active) {
            return res.status(400).json({ msg: "You will not Log In until admin give you access" })
        }

        const payload = {
            user: user._id
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: 360000
        })

        res.cookie("token", token, { httpOnly: true, expiresIn: 360000 })

        const { password, ...userData } = user._doc

        res.status(200).json({ msg: "User Logged In Successfully", data: userData })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Internal Server Error" })
    }

}

const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ msg: "User Logged Out Successfully" })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Internal Server Error" })
    }
}
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user)
       if (!user) {
        return res.status(400).json({ msg: "User not Found" })
       }

       const {password, ...userData} = user._doc;
       res.status(200).json({ msg: "User Found", data: userData })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Internal Server Error" })
    }
}

const updateUser = async (req, res) => {
    const formData = req.body
    try {
        let user = User.findById(req.user);

        if(!user){
            return res.status(404).json({ msg: "User not Found" })  
        }
        let exists = await User.findOne({email: formData.email})
        if(exists && exists._id?.toString() !== user._id?.toString()){
            return res.status(404).json({ msg: "Email Already Exists" })  
        }

        user = {
            firstName: formData.firstName ? formData.firstName : user.firstName,
            lastName: formData.lastName || user.lastName,
            phoneNumber: formData.phoneNumber || user.phoneNumber,
            email: formData.email || user.email,
            role: formData.role || user.role,
            active: formData.active || user.active,
        }

        console.log("user",user);

        res.status(200).json({ msg: "User Found", data: user })

        // const updatedUser = await user.save() 

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Internal Server Error" })
    }
}

module.exports = { registerUser, loginUser, logoutUser, getMe, updateUser }