const express = require('express')
const { registerUser, loginUser, getMe, updateUser, deleteUser, changePassword, getAllUsers, changeRoleAndStatus, forgotPassword, resetPassword } = require('../controller/userController')
const { authorizeUser, authorizeAdmin } = require('../middleware/auth')
const router = new express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/", authorizeAdmin, getAllUsers)
router.get("/me", authorizeUser, getMe)
router.patch("/update", authorizeUser, updateUser)
router.patch("/change", authorizeAdmin, changeRoleAndStatus)
router.post("/forgot-password", forgotPassword)
router.get("/reset-password/:id/:token", resetPassword)
router.patch("/changepassword", authorizeUser, changePassword)
router.delete("/delete/:userId", authorizeAdmin, deleteUser)

module.exports = router