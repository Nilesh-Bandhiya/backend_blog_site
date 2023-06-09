const express = require('express')
const { verify } = require('jsonwebtoken')
const { getMe, updateUser, deleteUser, getAllUsers, changeRoleAndStatus} = require('../controller/userController')
const { authorizeUser, authorizeAdmin } = require('../middleware/auth')
const { registerUser, loginUser, forgotPassword, checkTokenExpiry, resetPassword, changePassword, handleRefreshToken } = require('../controller/authController')
const router = new express.Router()

router.get("/", authorizeAdmin, getAllUsers)
router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/me", authorizeUser, getMe)
router.patch("/update", authorizeUser, updateUser)
router.patch("/change", authorizeAdmin, changeRoleAndStatus)
router.post("/refresh", handleRefreshToken)
router.post("/forgot-password", forgotPassword)
router.post("/check-expiry/:tokenId", checkTokenExpiry)
router.patch("/reset-password/:userId", resetPassword)
router.patch("/changepassword", authorizeUser, changePassword)
router.delete("/delete/:userId", authorizeAdmin, deleteUser)

module.exports = router