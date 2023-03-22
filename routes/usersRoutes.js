const express = require('express')
const { registerUser, loginUser, logoutUser, getMe, updateUser, deleteUser, changePassword, getAllUsers } = require('../controller/usersController')
const authorizeUser = require('../middleware/auth')
const router = new express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser )
router.get("/", authorizeUser, getAllUsers)
router.get("/logout", authorizeUser ,logoutUser )
router.get("/me", authorizeUser, getMe )
router.patch("/update", authorizeUser, updateUser )
router.patch("/changepassword", authorizeUser, changePassword )
router.delete("/delete", authorizeUser, deleteUser )

module.exports = router