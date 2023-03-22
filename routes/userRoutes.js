const express = require('express')
const { registerUser, loginUser, logoutUser, getMe, updateUser } = require('../controller/userController')
const authorizeUser = require('../middleware/auth')
const router = new express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser )
router.get("/logout", authorizeUser ,logoutUser )
router.get("/me", authorizeUser, getMe )
router.patch("/update", authorizeUser, updateUser )
router.patch("/forgotpassword", )
router.delete("/delete", )

module.exports = router